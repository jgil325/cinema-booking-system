import { z } from "zod";
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "../../db";
import { Booking, TicketType } from "@prisma/client";
import nodemailer from "nodemailer";

export const bookingRouter = createTRPCRouter({
    bookTickets: publicProcedure
        .input(
            z.object({
                showId: z.string(),
                seats: z.array(z.object({
                    seatNumber: z.string(), 
                    seatType: z.nativeEnum(TicketType),
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
                const { seatNumber, seatType } = seat; 

                // create seat in show if it doesnt exists
                const seatInShowData = await prisma.seatInShow.upsert({
                  where: {
                    showId_seatNumber: {
                      showId,
                      seatNumber: parseInt(seatNumber),
                    },
                  },
                  create: {
                    isOccupied: true,
                    seat: {
                      connect: {
                        id: show.SeatInShow[0].seat.id, // This is throwing erros but dont know why.
                      },
                    },
                    show: {
                      connect: {
                        id: showId,
                      },
                    },
                  },
                  update: {
                    isOccupied: true,
                  },
                  include: {
                    seat: {
                      include: {
                        ShowRoom: true,
                      },
                    },
                  },
                });

                // // Check if the seat in the show exists
                // const seatInShowData = await prisma.seatInShow.findUnique({
                //     where: {
                //         showId_seatNumber: {
                //             showId,
                //             seatNumber: parseInt(seatNumber),
                //         },
                //     },
                //     include: {
                //         seat: {
                //             include: {
                //             ShowRoom: true,
                //             },
                //         },
                //     },
                // });

                // if (!seatInShowData) {
                //     throw new Error(`Seat in show with id ${seatNumber} not found`);
                // }
                
                // Check if the seat is available
                if (seatInShowData.isOccupied) {
                    throw new Error(`Seat in show with id ${seatNumber} is not available`);
                }

                let ticketPrice;
                switch(seatType) {
                  case TicketType.CHILD:
                    ticketPrice = 5;
                    break;
                  case TicketType.ADULT:
                    ticketPrice = 15;
                    break;
                  case TicketType.SENIOR:
                    ticketPrice = 10;
                    break;
                  default:
                    throw new Error(`Invalid ticket type: ${seatType}`);
                }

                // Create the ticket
                const ticket = await prisma.ticket.create({
                    data: {
                        price: ticketPrice,
                        type: seatType,
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
                    totalPrice: (totalPrice * 0.1) + totalPrice + 1, // Tax plus price plus booking fee
                    promoDiscount: 0, // This may need to be removed
                    isPaymentComplete: false,
                    tickets: {
                        connect: tickets.map(ticket => ({ id: ticket.id })),
                    },
                },
            });
            console.log(booking)
            return booking;
        }),
        payForBooking: publicProcedure
            .input(
                z.object({
                    bookingId: z.string(),
                    paymentCardId: z.string(), // This may need to be updated
                    promoCode: z.string().optional(),
                    session: z.object({ // Session is used to help determine the payment card info
                      user: z.object({
                        id: z.string(),
                        email: z.string(),
                      }),
                    }),
                })
            )
            .mutation(async ({ ctx, input }) => {
                const {bookingId, paymentCardId, promoCode, session} = input;

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
                  // I feel like the logic for checking this payment card needs to be checked
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
            
                  if (paymentCard.userId !== session.user?.id) {
                    console.log(paymentCard.userId)
                    console.log(session.user?.id)
                    throw new Error(`You don't have permission to use this payment card`);
                  }
            
                  const basePrice = booking.totalPrice;

                  let totalPrice = basePrice;

                  if (promoCode) {
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
                    console.log(totalPrice)
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

                  try {
                    const transporter = nodemailer.createTransport({  
                        service: 'Gmail',
                        auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASS,
                        }
                    });
                    const seats = booking.tickets.map(ticket => ticket.seatNumber).join(', ');
                    console.log(seats)
                    // const movieTime = new Date(booking.tickets[0].Show.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    // const movieTime = booking.tickets[0]?.
                    // console.log(movieTime)
                    // const showRoom = booking.tickets[0].Show.ShowRoom.name;
                    // console.log(showRoom)
                    // const showTime = new Date(booking.tickets[0].Show.date).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    // console.log(showTime)
                    const email = session.user.email
                    const mailOptions = {
                        from: process.env.MAIL_USER,
                        to: email,
                        subject: 'Movie Booking Confirmation',
                        html: `Thank you for choosing to book with Cinema E-Booking.\n
                        Booking ID: ${booking.id}\n
                        Number of Tickets booked: ${booking.tickets.length}\n
                        Seat Numbers: ${seats}\n

                        `,// Need to add this functionality
                        
                    };
                    
                    transporter.sendMail(mailOptions, function(error: any, info: { response: any; }) {
                        if (error) {
                        console.log(error);
                        } else {
                        console.log(`Booking Confirmation Email sent to ${email}.`);
                        }
                    });
                    return {
                        message: 'successfully sent email!',
                        email: email
                    }
                } catch {
                    return new TRPCError({
                        code: 'CONFLICT',
                        message: 'failed sending email'
                    })
                }
            
                  // return true;
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
    getShowingSeats: publicProcedure // returns rows from SeatInShow with matching showId numbers
      .input(
        z.object({
          showId: z.string().min(1),
        })
      )
      .query(async ({ ctx, input }) => {
        const seatInShows = await ctx.prisma.seatInShow.findMany({
          where: {
            showId: input.showId
          },
        })
        if (!seatInShows) {
          return [];
        }
        return seatInShows;
      }),
    getAllUserBookings: publicProcedure // used when getting all bookings on booking page
      .input(
        z.object({
          userID: z.string().min(1),
      }))
      .query(async ({ctx, input}) => {
        const allBookings = await ctx.prisma.booking.findMany({
          where: {
            userId: input.userID
          }
        });
        if (!allBookings) {
          return [];
        }
        // decrypt payment card info
        return allBookings;
      }),
    getBookingByID: publicProcedure // used to find user's new booking on order confirmation page
      .input(
        z.object({
          bookingID: z.string().min(1)
        }))
      .query(async ({ctx, input}) => {
        const newBooking = await ctx.prisma.booking.findUnique({
          where: {
            id: input.bookingID
          }
        });
        if (!newBooking) {
          throw new Error('Error finding newly created booking.')
        }
        return newBooking;
      }),
});