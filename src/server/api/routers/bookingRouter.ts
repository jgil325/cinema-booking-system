import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "../../db";
import { TicketType } from "@prisma/client";

export const bookingRouter = createTRPCRouter({
    bookTickets: publicProcedure
        .input(
            z.object({
                showId: z.string(),
                seats: z.array(z.object({
                    seatNumber: z.string(),
                }))
            })
        )
        .mutation(async ({ ctx, input}) => {
            const { showId, seats } = input;

            // Check if the show exists
            const show = await prisma.show.findUnique({
              where: {
                id: showId,
              },
              include: {
                Movie: true,
                SeatInShow: {
                  include: {
                    seat: {
                      include: {
                        ShowRoom: true,
                      },
                    },
                  },
                },
              },
            });

            if (!show) {
                throw new Error(`Show with id ${showId} not found`);
            }
            
            const tickets = [];
            for (const seat of seats) {
                const { seatNumber } = seat;

                // Check if the seat in the show exists
                const seatInShowData = await prisma.seatInShow.findUnique({
                    where: {
                        showId_seatNumber: {
                            showId,
                            seatNumber: parseInt(seatNumber),
                        },
                    },
                    include: {
                        seat: {
                            include: {
                            ShowRoom: true,
                            },
                        },
                    },
                });

                if (!seatInShowData) {
                    throw new Error(`Seat in show with id ${seatNumber} not found`);
                }
                
                // Check if the seat is available
                if (seatInShowData.isOccupied) {
                    throw new Error(`Seat in show with id ${seatNumber} is not available`);
                }

                // Create the ticket
                const ticket = await prisma.ticket.create({
                    data: {
                        price: show.Movie.rating === "R" ? 15 : 10,
                        type: TicketType.ADULT,
                        showId,
                        seatNumber: parseInt(seatNumber),
                    },
                });
                console.log(ticket.id)
                tickets.push(ticket);

                // Update the seatInShow to mark it as occupied
                await prisma.seatInShow.update({
                    where: {
                        showId_seatNumber: {
                            showId,
                            seatNumber: parseInt(seatNumber),
                        }
                    },
                    data: {
                        isOccupied: true,
                    },
                });
            }

            // Calculate the total price
            const totalPrice = tickets.reduce((acc, ticket) => acc + ticket.price, 0);

            // Create the booking
            const booking = await prisma.booking.create({
                data: {
                    bookingFee: 1,
                    tax: totalPrice * 0.1,
                    totalPrice: show.Movie.rating === "R" ? 17.5 : 12.5, // replace with your own ticket pricing logic
                    promoDiscount: 0, // replace with your own promo discount logic
                    isPaymentComplete: false,
                    tickets: {
                        connect: tickets.map(ticket => ({ id: ticket.id })),
                    },
                },
            });

            return booking;
        }),
        payForBooking: publicProcedure
            .input(
                z.object({
                    bookingId: z.string(),
                    paymentCardId: z.string(),
                    promoCode: z.string().optional(),
                })
            )
            .mutation(async ({ ctx, input }) => {
                const {bookingId, paymentCardId, promoCode} = input;

                const booking = await prisma.booking.findUnique({
                    where: {
                        id: bookingId,
                    },
                    include: {
                        tickets: true,
                    },
                });

                if (!booking) {
                    throw new Error(`Booking with id ${bookingId} not found`);
                  }
            
                  if (booking.isPaymentComplete) {
                    throw new Error(`Booking with id ${bookingId} has already been paid`);
                  }
            
                  // Fetch payment card
                  const paymentCard = await prisma.paymentCard.findUnique({
                    where: {
                      id: paymentCardId,
                    },
                    include: {
                      User: true,
                    },
                  });
            
                  if (!paymentCard) {
                    throw new Error(`Payment card with id ${paymentCardId} not found`);
                  }
            
                  if (paymentCard.userId !== ctx.user?.id) {
                    throw new Error(`You don't have permission to use this payment card`);
                  }
            
                  const basePrice = booking.totalPrice + booking.tax + booking.bookingFee;

                  // Calculate total price
                  let totalPrice = basePrice;

                  if (promoCode) {
                    // Fetch the promotion with the provided code
                    const promotion = await prisma.promotion.findUnique({
                      where: {
                        code: promoCode,
                      },
                    });

                    if (!promotion) {
                      throw new Error(`Promotion with code ${promoCode} not found`);
                    }

                    const currentDate = new Date();
                    if (currentDate < promotion.startDate || currentDate > promotion.endDate) {
                      throw new Error(`Promotion with code ${promoCode} is not valid at this time`);
                    }

                    totalPrice = basePrice * (1 - promotion.discount);
                  }
            
                  // Charge payment card
                //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
                //     apiVersion: '2020-08-27',
                //   });
            
                  console.log("Assuming payment for card went successfully")
            
                  // Update booking to mark it as paid
                  await prisma.booking.update({
                    where: {
                      id: bookingId,
                    },
                    data: {
                      isPaymentComplete: true,
                    },
                  });
            
                  return true;
            }),
            cancelBooking: protectedProcedure 
            // Added this functionality as a cancel button so if the user decides to not pay they can cancel their booking
            .input(
              z.object({
                bookingId: z.string(),
              })
            )
            .mutation(async ({ ctx, input }) => {
              const { bookingId } = input;
        
              const booking = await prisma.booking.findUnique({
                where: {
                  id: bookingId,
                },
                include: {
                  tickets: true,
                },
              });
        
              if (!booking) {
                throw new Error(`Booking with id ${bookingId} not found`);
              }
        
              if (booking.isPaymentComplete) {
                throw new Error(`Booking with id ${bookingId} has already been paid and cannot be canceled`);
              }
        
              // Delete tickets and mark seats as not occupied
              for (const ticket of booking.tickets) {
                await prisma.ticket.delete({
                  where: {
                    id: ticket.id,
                  },
                });
        
                await prisma.seatInShow.update({
                  where: {
                    showId_seatNumber: {
                      showId: booking.showId,
                      seatNumber: ticket.seatNumber,
                    },
                  },
                  data: {
                    isOccupied: false,
                  },
                });
              }
        
              // Delete booking
              await prisma.booking.delete({
                where: {
                  id: bookingId,
                },
              });
        
              return true;
            }),
});
