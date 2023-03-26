import { createTRPCRouter, publicProcedure } from '../trpc'
import {z} from 'zod'
import validator from 'validator';
import bcrypt from 'bcrypt';
import { TRPCError } from '@trpc/server';

export const paymentRouter = createTRPCRouter({
  createPaymentInfo: publicProcedure
    .input(
      z.object({ // TODO: Need some way to make all these errors user friendly.
        //Payment Validation
        cardNumber: z
          .union([z.string().refine((value) => validator.isCreditCard(value), {
            message: "Please enter a valid credit card number.",
          }), z.string().length(0)])
          .optional()
          .transform(e => e === "" ? undefined : e),
        cardType: z.enum(["VISA", "MASTERCARD", "DISCOVER", "AMEX"]),
        billingAddress: z
          .union([z.string().max(100), z.string().length(0)])
          .optional()
          .transform(e => e === "" ? undefined : e),
        expirationMonth: z
          .union([z.number().min(1, { message: "Please enter a valid month." }).max(12, { message: "Please enter a valid month." }), z.number().optional()]),
        expirationYear: z
          .union([z.number().min(1, { message: "Please enter a valid expiration year." }), z.number().optional()]),
        billingCity: z
          .union([z.string().min(1, { message: "Please enter a valid city." }), z.string().length(0)])
          .optional()
          .transform(e => e === "" ? undefined : e),
        billingState: z
          .union([z.string().min(1), z.string().length(0)])
          .optional()
          .transform(e => e === "" ? undefined : e),
        billingZipCode: z
          .union([z.string().length(5, { message: "Please enter a valid zip code."}), z.string().length(0)])
          .optional()
          .transform(e => e === "" ? undefined : e),
        userId: z.string(),
      })
      .refine((value) => {
        if (
          (!value.cardNumber && !value.billingAddress && !value.expirationMonth && !value.expirationYear && !value.billingCity && !value.billingState && !value.billingZipCode) ||
          (value.cardNumber && value.billingAddress && value.expirationMonth && value.expirationYear && value.billingCity && value.billingState && value.billingZipCode)
        ) {
          return true;
        }
        throw new Error('All payment fields are required if you want to add a payment card. \nPlease remove all data from fields if you do not want to create a payment card.')
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

        const encodedCard = await bcrypt.hash(cardNumber, 10);
        //const encodedCard = Buffer.from(cardNumber).toString('base64') // using string -> base64 encode
        //const encodedCard = btoa(cardNumber);
        //console.log(encodedCard);

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

  byId: publicProcedure
    .query(async ({ ctx }) => {
      try {
        const userID = ctx.session?.user.id;
        const cards = await ctx.prisma.paymentCard.findMany({
          where: { 
            userId: userID 
          },
        });
        // decrypt card number
        //const compare = await bcrypt.compare(input.password, dbUserPass);
        /*for (let i = 0; i< cards.length; i++) {
          const encryptedCardNumber = cards[i]!.cardNumber
          //const plainTextCardNumber = Buffer.from(encryptedCardNumber || '','base64').toString('ascii') // base64 back to ascii
          const plainTextCardNumber = atob(encryptedCardNumber);
          cards[i]!.cardNumber = plainTextCardNumber;
        }*/
        return cards;
      } catch {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'unable to fetch cards'
        })
      }
    }),

  all: publicProcedure.query(async ({ ctx }) => { // NOT TESTED OR USED // no error checking
    const cards = await ctx.prisma.paymentCard.findMany();
    return cards;
  }),
});

