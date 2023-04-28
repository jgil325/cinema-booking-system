import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "../../db";
import { TicketType } from "@prisma/client";
import nodemailer from "nodemailer";

export const bookingRouter = createTRPCRouter({
  reserveTickets: publicProcedure
    .input(
      z.object({
        showId: z.string(),
        showRoomId: z.string(),
        seats: z.array(
          z.object({
            seatNumber: z.number(),
            seatType: z.nativeEnum(TicketType),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { showId, showRoomId, seats } = input;

      if (!showRoomId) {
        throw new Error(`Show room id not found for show with id ${showId}`);
      }

      const seatsInShow = [];
      for (const seat of seats) {
        const { seatNumber } = seat;

        // Check if seat is already occupied in the show
        const checkseatInShow = await prisma.seatInShow.findUnique({
          where: {
            showId_seatNumber: {
              showId: showId,
              seatNumber: seatNumber,
            },
          },
        });
        let seatInShow;
        if (checkseatInShow) {
          seatsInShow.push(checkseatInShow);
        } else {
          seatInShow = await prisma.seatInShow.create({
            data: {
              isOccupied: true,
              seat: {
                connect: {
                  showRoomId_seatNumber: {
                    showRoomId: showRoomId,
                    seatNumber: seatNumber,
                  },
                },
              },
              show: {
                connect: {
                  id: showId,
                },
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
          seatsInShow.push(seatInShow);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const fees = await ctx.prisma.fees.findUnique({
        where: {
          id: "masterFees",
        },
      });
      if (!fees) {
        throw new Error('Fees not found');
      }

      const tickets = [];
      for (const seat of seats) {
        const { seatNumber, seatType } = seat;

        let ticketPrice = 0;
        switch (seatType) {
          case TicketType.CHILD:
            ticketPrice = fees.childFee;
            break;
          case TicketType.ADULT:
            ticketPrice = fees.adultFee;
            break;
          case TicketType.SENIOR:
            ticketPrice = fees.seniorFee;
            break;
          default:
            throw new Error(`Invalid ticket type: ${seatType}`);
        }

        // Check if a ticket already exists for this seatNumber
        /*const checkTicket = await prisma.ticket.findFirst({
          where: {
            seatNumber: seatNumber,
          },
        });*/

        if (false) {
          //tickets.push(checkTicket);
        } else {
          // Create the ticket
          const ticket = await prisma.ticket.create({
            data: {
              price: ticketPrice,
              type: seatType,
              showId,
              seatNumber: seatNumber,
            },
          });

          tickets.push(ticket);
        }
      }
      console.log(tickets);
      return tickets;
    }),

  bookAndPay: publicProcedure
    .input(
      z.object({
        tickets: z.array(
          z.object({
            id: z.string(),
            price: z.number(),
            type: z.enum(["CHILD", "ADULT", "SENIOR"]),
            showId: z.string(),
            seatNumber: z.number(),
          })
        ),
        paymentCardNumber: z.string(), // USE CARD NUMBER
        promoCode: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;
      if (!session)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be logged in to book a ticket",
        });
      const { tickets, paymentCardNumber, promoCode } = input;
      let bookingFee = 0;
      const tax = 0.1;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const fees = await ctx.prisma.fees.findUnique({
        where: {
          id: "masterFees",
        },
      });
      if (!fees) {
        throw new Error('Fees not found');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      bookingFee = fees.bookingFee

      // Calculate the total price
      const ticketTotal = tickets.reduce(
        (acc, ticket) => acc + ticket.price,
        0
      );
      let totalPrice = ticketTotal + bookingFee;

      const buf = Buffer.from(paymentCardNumber, 'utf8');
      const encodedCard = (buf.toString('base64')).toString()

      const paymentCard = await prisma.paymentCard.findFirst({
        where: {
          cardNumber: encodedCard,
          userId: session.user.id,
        },
        include: {
          User: true,
        },
      });

      if (!paymentCard) {
        throw new Error(`Payment card with id ${paymentCardNumber} not found`);
      } else {
        console.log(paymentCard.cardNumber)
      }

      if (paymentCard.userId !== session.user?.id) {
        console.log(paymentCard.userId);
        console.log(session.user?.id);
        throw new Error(`You don't have permission to use this payment card`);
      }

      let promotionDiscount = 0;
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
        if (
          currentDate < promotion.startDate ||
          currentDate > promotion.endDate
        ) {
          throw new Error(
            `Promotion with code ${promoCode} is not valid at this time`
          );
        }

        promotionDiscount = promotion.discount;
        totalPrice = totalPrice * (1 - promotionDiscount);
      }

      const totalTax = totalPrice * tax;
      totalPrice = totalPrice * tax + totalPrice;

      const singleTicket = tickets[0];
      const showId = singleTicket?.showId;

      let show;
      if (showId) {
        show = await prisma.show.findFirst({
          where: { id: showId },
          include: {
            Movie: true,
          },
        });
      }

      const showTitle = show.Movie.title;
      // TODO: MAKE SURE THAT A BOOKING CANNOT BE DOUBLE CREATED
      // Create the booking

      // Decrypt
      // for (var card of cards) {
      //   //console.log(card.cardNumber)
      //   var encryptedCardNumber = card.cardNumber;
      //   var buf = Buffer.from(encryptedCardNumber, 'base64');
      //   var de = buf.toString('utf8')
      //   card.cardNumber = de
      // }

      // encrypt
      // const buf = Buffer.from(cardNumber, 'utf8');
      //   const encodedCard = (buf.toString('base64')).toString()
      const booking = await prisma.booking.create({
        data: {
          cardNumber: paymentCard.cardNumber,
          showDate: show.showTime,
          showTitle: showTitle,
          tax: totalTax,
          totalPrice: totalPrice,
          ticketTotal: ticketTotal,
          promoDiscount: promotionDiscount,
          User: {
            connect: {
              id: session.user.id,
            },
          },
          tickets: {
            connect: tickets.map((ticket) => ({ id: ticket.id })),
          },
        },
      });
      console.log(booking);

      console.log("Assuming payment for card went successfully");

      try {
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });
        const email = session.user.email;

        const seatsList = []
        let ticketSeats
        for (ticketSeats of tickets) {
          seatsList.push(ticketSeats.seatNumber)
        }
        const seatListString = seatsList.join(',');
        const showDataString = show?.showTime.toString() ?? '';

        const mailOptions = {
          from: process.env.MAIL_USER,
          to: email,
          subject: "Movie Booking Confirmation",
          html: `Thank you for choosing to book with Cinema E-Booking.\n
            Booking ID: ${booking.id}\n
            Show Title: ${showTitle}\n
            Show Date: ${showDataString}\n
            Tickets: ${seatListString}\n
            Total Cost: ${totalPrice}\n

            `, // TODO: Need to add this functionality
        };

        transporter.sendMail(
          mailOptions,
          function (error: any, info: { response: any }) {
            if (error) {
              console.log(error);
            } else {
              console.log(`Booking Confirmation Email sent to ${email}.`);
            }
          }
        );
        return {
          message: "successfully sent email!",
          email: email,
          booking: booking,
        };
      } catch {
        return new TRPCError({
          code: "CONFLICT",
          message: "failed sending email",
        });
      }
      return booking; // Find a better place for this
    }),
  // Potential add cancel booking
  // Checks for booking id
  // Detel tickets and seats marked as occupied
  // cancelBooking: protectedProcedure
  getShowingSeats: publicProcedure // returns rows from SeatInShow with matching showId numbers
    .input(
      z.object({
        showId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const seatInShows = await ctx.prisma.seatInShow.findMany({
        where: {
          showId: input.showId,
        },
      });
      if (!seatInShows) {
        return [];
      }
      return seatInShows;
    }),
  getOccupiedSeats: publicProcedure
    .input(
      z.object({
        showId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const seatInShows = await ctx.prisma.seatInShow.findMany({
        where: {
          showId: input.showId,
        },
        include: {
          seat: true,
        },
      });
      if (!seatInShows) {
        return [];
      }
      const occupiedSeats = seatInShows.filter(
        (seatInShow) => seatInShow.isOccupied
      );

      return occupiedSeats.map((seatInShow) => ({
        seatNumber: seatInShow.seatNumber,
        showRoomId: seatInShow.seat.showRoomId,
      }));
    }),
  getAllUserBookings: publicProcedure // used when getting all bookings on booking page
    .input(
      z.object({
        userID: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const allBookings = await ctx.prisma.booking.findMany({
        where: {
          userId: input.userID,
        },
      });
      if (!allBookings) {
        return [];
      }
      // decrypt payment card info
      for (var book of allBookings) {
        //console.log(card.cardNumber)
        var encryptedCardNumber = book.cardNumber;
        var buf = Buffer.from(encryptedCardNumber, 'base64');
        var de = buf.toString('utf8')
        book.cardNumber = de
      }
      var fullBookings = []
      for (var book of allBookings) {
        var bookID = book.id
        const tickets = await ctx.prisma.ticket.findMany({
          where: {
            bookingId: bookID
          },
          select: {
            seatNumber: true,
            id: true
          }
        });
        const listTickets = {"tickets":tickets}
        var combined = Object.assign({}, book, listTickets)
        //console.log(combined)
        fullBookings.push(combined)
      }
      return fullBookings;
    }),
  getBookingByID: publicProcedure // used to find user's new booking on order confirmation page
    .input(
      z.object({
        bookingID: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const newBooking = await ctx.prisma.booking.findUnique({
        where: {
          id: input.bookingID,
        },
      });
      if (!newBooking) {
        throw new Error("Error finding newly created booking.");
      }
      return newBooking;
    }),
  getShowRoomIdByShowId: publicProcedure // Used in the reserveTickets functionality
    .input(
      z.object({
        showingID: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { showingID } = input;
      console.log(showingID);
      const show = await ctx.prisma.show.findUnique({
        where: {
          id: showingID,
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
      console.log(show?.showRoomId);
      return show?.showRoomId;
    }),
  getTotalPrice: publicProcedure
    .input(
      z.object({
        tickets: z.array(
          z.object({
            id: z.string(),
            price: z.number(),
            type: z.enum(["CHILD", "ADULT", "SENIOR"]),
            showId: z.string(),
            seatNumber: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { tickets } = input;
      const bookingFee = 1;
      const tax = 0.1;

      // Calculate the total price
      const ticketTotal = tickets.reduce(
        (acc, ticket) => acc + ticket.price,
        0
      );
      let totalPrice = ticketTotal + bookingFee;

      const totalTax = totalPrice * tax;
      totalPrice = totalTax + totalPrice;

      return totalPrice;
    }),
  getNumberOfSeatsInShowRoom: publicProcedure
    .input(
      z.object({
        showingId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { showingId } = input;
      const numberOfSeats = await prisma.show.findUnique({
        where: { id: showingId },
        select: {
          showRoom: { select: { numberOfSeats: true } },
        },
      });
      console.log(numberOfSeats);
      return numberOfSeats;
    }),
});
