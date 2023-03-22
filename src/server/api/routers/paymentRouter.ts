import { createTRPCRouter, publicProcedure } from '../trpc'
import {z} from 'zod'
import validator from 'validator';

export const paymentRouter = createTRPCRouter({
  createPaymentInfo: publicProcedure
    .input(
      z.object({ // TODO: Need some way to make all these errors user friendly.
        cardNumber: z.string().refine(value => validator.isCreditCard(value), {message: "Please enter a valid credit card number."}), 
        cardType: z.enum(["VISA", "MASTERCARD", "DISCOVER", "AMEX"]),
        billingAddress: z.string().max(100),
        expirationMonth: z.number().min(1, {message: "Please enter a valid month."}).max(12, {message: "Please enter a valid month."}),
        expirationYear: z.number().min(new Date().getFullYear()).max(9999),
        billingCity: z.string().min(1, {message: "Please enter a valid city."}), 
        billingState: z.string().min(1), 
        billingZipCode: z.string().length(5, {message: "Please enter a valid zip code."}),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input}) => {
      try {
        const {cardNumber, cardType, billingAddress, expirationMonth, expirationYear, billingCity, billingState, billingZipCode, userId } = input; // userId
        // TODO: Check to see if this works and can only add three payment cards
        const cardCount = await ctx.prisma.paymentCard.count({ where: { userId } });
        if (cardCount >= 3) {
          throw new Error('A user can only have up to three payment cards');
        }

        // Validate expiration month and year
        const currentYear = new Date().getFullYear(); 
        if (expirationYear < currentYear || (expirationYear === currentYear && expirationMonth < new Date().getMonth() + 1)) {
          throw new Error('Card has already expired');
        }

        const bcrypt = require('bcrypt');
        const encodedCard = await bcrypt.hash(cardNumber, 10);

        const newCard = await ctx.prisma.paymentCard.create({ 
          data: {
            cardNumber: encodedCard,
            cardType: cardType, 
            billingAddress: billingAddress, // TODO: Build and Validate building address, // TODO: make sure their can only be one shipping address
            expirationMonth: expirationMonth,  
            expirationYear: expirationYear, 
            billingCity: billingCity,
            billingState: billingState,
            billingZipCode: billingZipCode, 
            userId: userId,
          },
        });
        return newCard;
      } catch (error) {
        // ctx.prisma.user.delete({where: {id: input.userId}});
        console.error('Error creating payment info:', error);
        throw new Error('Could not create payment info');
      }
    }),

  delete: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => { // Not tested
    try {
      const deletedCard = await ctx.prisma.paymentCard.delete({
        where: { id: input },
      });

      return deletedCard;
    } catch (error) {
      console.error('Error deleting payment card:', error);
      throw new Error('Could not delete payment card');
    }
  }),

  byId: publicProcedure // NOT TESTED OR USED // NO error checking
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const card = await ctx.prisma.paymentCard.findUnique({
        where: { id: input.id },
      });

      return card;
    }),

  all: publicProcedure.query(async ({ ctx }) => { // NOT TESTED OR USED // no error checking
    const cards = await ctx.prisma.paymentCard.findMany();
    return cards;
  }),
});

