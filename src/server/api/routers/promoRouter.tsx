import { createTRPCRouter, publicProcedure } from '../trpc'
import {z} from 'zod'
import { CardType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts"; // uses bcrypt-ts instead of bcrypt

export const promoRouter = createTRPCRouter({

});