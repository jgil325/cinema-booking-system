import { createTRPCRouter, publicProcedure } from '../trpc';
import {z} from 'zod'
import { v4 as uuidv4 } from "uuid";

export const feesRouter = createTRPCRouter({
    updateFees: publicProcedure
        .input(
            z.object({
                bookingFee: z.number().gt(0).lt(100),
                adultFee: z.number().gt(0).lt(100),
                childFee: z.number().gt(0).lt(100),
                seniorFee: z.number().gt(0).lt(100),
            })
        )
        .mutation(async ({ctx, input}) => {
            const updatedFees = ctx.prisma.fees.update({
                where: {
                    id: 'masterFees' // only fee entry in DB
                },
                data: {
                    bookingFee: input.bookingFee,
                    adultFee: input.adultFee,
                    childFee: input.childFee,
                    seniorFee: input.seniorFee,
                }
            });
            if (!updatedFees) {
                throw new Error('Issue updating booking or ticket fees.')
            }
            return updatedFees;
        }),
    getAllFees: publicProcedure
        .query(async ({ ctx }) => {
            const allFees =  ctx.prisma.fees.findUnique({
                where: {
                    id: 'masterFees' // only fee entry in DB
                }
            });
            if (!allFees) {
                throw new Error('Failed to fetch booking or ticket fees.')
            }
            return allFees;
        }),

})