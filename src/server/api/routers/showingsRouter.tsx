import { createTRPCRouter, publicProcedure } from '../trpc';
import {z} from 'zod'
import { v4 as uuidv4 } from "uuid";
import { MovieStatus } from '@prisma/client';

export const showingsRouter = createTRPCRouter({
    createShow: publicProcedure
        .input(
            z.object({
                movieId: z.string().min(1, {message: 'Provide a movie ID to schedule show'}),
                showTime: z.date(), // just time
                // other args?
            })
            .refine((inputs) => {
                if (inputs.showTime < new Date()) {
                    return false
                }
                return true
            }, {message: 'Show start date must be after current date!'})
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
                    where: {
                        movieId: input.movieId
                    },
                    select: {
                        showTime: true
                    }
                })
                var uniqueShowTime = true // maybe not necessary
                for (var show of currentShowDateTimes) {
                    if (show.showTime.getTime() === input.showTime.getTime()) {
                        uniqueShowTime = false // maybe not necessary
                        throw new Error('Cannot schedule show at same time and date as another show.')
                    }
                }
                if (uniqueShowTime) {
                    const newShow = await ctx.prisma.show.create({
                        data: {
                            id: uuidv4(),
                            showTime: input.showTime,
                            showDurationMinutes: 120, // default value, not sure if keeping
                            movieId: input.movieId,
                            showRoomId: 'temp' // no showRoomId yet
                        }
                    });
                    if (newShow) {
                        const updatedMovieStatus = await ctx.prisma.movie.update({
                            where: {
                                id: input.movieId
                            },
                            data: {
                                status: MovieStatus.CURRENTLYSHOWING
                            }
                        });
                        if (!updatedMovieStatus) {
                            throw new Error(`Issue updating showing status for movie: ${input.movieId}`)
                        }
                        return newShow
                    } else {
                        throw new Error(`Issue creating showing for movie: ${input.movieId}`)
                    }
                }
            }
        }),
    deleteShow: publicProcedure // maybe unused, not tested
        .input(
            z.object({
                id: z.string().min(1, {message: 'Provide a valid show ID'})  
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
    byId: publicProcedure
        .input(
            z.object({
                id: z.string().min(1, {message: 'Provide a valid show ID'})
            })
        )
        .mutation(async ({ ctx, input }) => {
            const foundShow = await ctx.prisma.show.findUnique({
                where: {
                    id: input.id
                }
            });
            if (foundShow) {
                return foundShow
            } else {
                throw new Error('Could not find a show with provided ID');
            }
        }),
    getAllShows: publicProcedure
        .query(async ({ ctx }) => {
            const allShows = await ctx.prisma.show.findMany();
            if (allShows) {
                return allShows
            } else {
                throw new Error('No shows are currently active')
            }
        }),
});