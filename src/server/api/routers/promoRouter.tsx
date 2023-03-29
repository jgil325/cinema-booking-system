import { createTRPCRouter, publicProcedure } from '../trpc'
import {z} from 'zod'
import { TRPCError } from '@trpc/server';
import { v4 as uuidv4 } from "uuid";

export const promoRouter = createTRPCRouter({
    createPromo: publicProcedure // should this be private later since only admin access???
        .input(
            z.object({
                title: z.string().min(1, {message: 'Promotion must have a title'}),
                description: z.string().min(1, {message: 'Promotion must have a description'}),
                discountPercent: z.number().gte(0, {message: 'Percentage must be greater than or equal to 0%'})
                    .lte(1, {message: 'Percentage must be less than or equal to 100%'}),
                discountCode: z.string().min(3, {message: 'Discount code must be 3 characters or greater'}),
                startDate: z.date().min(new Date(), {message: 'Promotion date cannot start prior to now'}),
                endDate: z.date().max(new Date('2024-01-01'), {message: 'Promotion end date must be before January 1st, 2024'})
            })
            .refine((inputs) => {
                if (inputs.startDate >= inputs.endDate) {
                    throw new Error('Promo start date must be before the promo end date!')
                }
            })
        )
        .mutation(async ({ ctx, input }) => {
            // currently no unique descriptor for promos thus same promo can be create twice
            const newPromotion = await ctx.prisma.promotion.create({
                data: {
                    id: uuidv4(),
                    title: input.title,
                    description: input.description,
                    discount: input.discountPercent,
                    code: input.discountCode,
                    startDate: input.startDate,
                    endDate: input.endDate,
                }
            });
            if (newPromotion) {
                return newPromotion
            } else {
                throw new Error('Failed to create new promotion')
            }
        }),
    byCode: publicProcedure
        .input(
            z.object({
                code: z.string().min(3, {message: 'Please provide a valid promotion code'})
            })
        )
        .query(async ({ ctx, input }) => {
            const foundPromo = ctx.prisma.promotion.findFirst({ // no unique identifier for promo codes but should be okay
                where: {
                    code: input.code
                }
            });
            if (foundPromo) {
                return foundPromo
            } else {
                throw new Error('No promotion exists by this specific promotion code')
            }
        }),
    getAllPromos: publicProcedure
        .query(async ({ ctx }) => {
            const allPromos = ctx.prisma.promotion.findMany();
            if (allPromos) {
                return allPromos
            } else {
                throw new Error('No promotions are currently active')
            }
        }),
});