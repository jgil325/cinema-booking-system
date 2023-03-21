import { createTRPCRouter, publicProcedure } from '../trpc'
import {z} from 'zod'
import { v4 as uuidv4 } from 'uuid';
import { StatusType } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export const editProfileRouter = createTRPCRouter({
    changeName: publicProcedure.query(({ ctx }) => {
        // obviously mutate instead
        //
        return ctx.prisma.user.findMany({ orderBy: { id: "desc" } });
    }),

});