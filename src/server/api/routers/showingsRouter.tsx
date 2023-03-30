import { createTRPCRouter, publicProcedure } from '../trpc';
import {z} from 'zod'
import { v4 as uuidv4 } from "uuid";
//import { MovieStatus } from '@prisma/client';

export const showingsRouter = createTRPCRouter({
    createShow: publicProcedure
        .input(
            z.object({
                movieId: z.string().min(1, {message: 'Provide a movie ID to schedule show'}),
                showDate: z.date(), // just date
                showTime: z.date(), // just time
                // other args?
            })
            .refine((inputs) => {
                if (inputs.showDate < new Date()) {
                    throw new Error('Show start date must be after current date!')
                }
                // showTime refine??
            })
        )
        .mutation(async ({ ctx, input }) => {
            const foundMovie = await ctx.prisma.movie.findUnique({
                where: {
                    id: input.movieId
                }
            })
            if (!foundMovie) {
                throw new Error('No movie exists by this ID')
            } else {
                const currentShowDateTimes = await ctx.prisma.show.findMany({
                    select: {
                        showDate: true,
                        showTime: true
                    }
                })
                var uniqueShowTime = true
                for (var show of currentShowDateTimes) {
                    if ((show.showDate == input.showDate)&&(show.showTime == input.showTime)) {
                        uniqueShowTime = false
                        throw new Error('Cannot schedule show at same time and date as another show.')
                    }
                }
                if (uniqueShowTime) {
                    const newShow = await ctx.prisma.show.create({
                        data: {
                            id: uuidv4(),
                            //createdAt and updatedAt already generate i think
                            showDate: input.showDate,
                            showTime: input.showTime,
                            showDurationMinutes: 120,
                            movieId: input.movieId,
                            showRoomId: 'null' // no showRoomId yet
                        }
                    });
                    if (newShow) {
                        return newShow
                    } else {
                        throw new Error(`Issue creating showing for movie: ${input.movieId}`)
                    }
                }
            }
        }),
    deleteShow: publicProcedure
        .input(
            z.object({
                id: z.string()   
            })
        )
        .mutation(async ({ ctx, input }) => {
            const deletedShow = await ctx.prisma.show.delete({
                where: {
                    id: input.id
                }
            });
            if (deletedShow) {
                return deletedShow
            } else {
                throw new Error('Issue finding or deleting show. Try again in a minute.')
            }
        }),
    // editShow:?
});