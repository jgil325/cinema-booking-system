import { createTRPCRouter, publicProcedure } from '../trpc';
import {z} from 'zod'
import { v4 as uuidv4 } from "uuid";
import { StatusType, UserRole } from '@prisma/client';

export const manageUsersRouter = createTRPCRouter({
    suspendUser: publicProcedure
        .input(
            z.object({
                email: z.string().email({message: 'Provide a valid email address'})
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userToSuspend = await ctx.prisma.user.update({
                where: {
                    email: input.email
                },
                data: {
                    statusType: StatusType.SUSPENDED
                }
            });
            if (!userToSuspend) {
                throw new Error('No user exists with this email address')
            }
            return userToSuspend;
        }),
    unsuspendUser: publicProcedure
        .input(
            z.object({
                email: z.string().email({message: 'Provide a valid email address'})
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userToUnsuspend = await ctx.prisma.user.update({
                where: {
                    email: input.email
                },
                data: {
                    statusType: StatusType.ACTIVE
                }
            });
            if (!userToUnsuspend) {
                throw new Error('No user exists with this email address')
            }
            return userToUnsuspend;
        }),
    promoteToAdmin: publicProcedure
    // unused
        .input(
            z.object({
                email: z.string().email({message: 'Provide a valid email address'})
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userToPromote = await ctx.prisma.user.update({
                where: {
                    email: input.email
                },
                data: {
                    role: UserRole.ADMIN
                }
            });
            if (!userToPromote) {
                throw new Error('No user exists with this email address')
            }
            return userToPromote;
        }),
    demoteToUser: publicProcedure
    // unused
        .input(
            z.object({
                email: z.string().email({message: 'Provide a valid email address'})
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userToDemote = await ctx.prisma.user.update({
                where: {
                    email: input.email
                },
                data: {
                    role: UserRole.CUSTOMER
                }
            });
            if (!userToDemote) {
                throw new Error('No user exists with this email address')
            }
            return userToDemote;
        }),
});