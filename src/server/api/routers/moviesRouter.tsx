import { createTRPCRouter, publicProcedure } from '../trpc';
import {z} from 'zod'
import { v4 as uuidv4 } from "uuid";
import { MovieStatus } from '@prisma/client';

export const moviesRouter = createTRPCRouter({
    createMovie: publicProcedure
        .input(
            z.object({
                title: z.string().min(1, {message: 'Movie must have a title'}),
                category: z.string().min(1, {message: 'Movie must have a category'}),
                cast: z.string().min(1, {message: 'Movie must have a cast'}),
                director: z.string().min(1, {message: 'Movie must have a director'}),
                producer: z.string().min(1, {message: 'Movie must have a producer'}),
                synopsis: z.string().min(1, {message: 'Movie must have a synopsis'}),
                rating: z.string().min(1, {message: 'Movie must have a rating'}),
                //review: z.number().gte(0, {message: 'Rating must be greater than or equal to 0})
                    //.lte(10, {message: 'Rating must be less than or equal to 10})
                // reviews, showing added afterward im guessing, thus not included in input
            })
        )
        .mutation(async ({ ctx, input }) => {
            const newMovie = ctx.prisma.movie.create({
                data: {
                    id: uuidv4(),
                    title: input.title,
                    category: input.category,
                    cast: input.cast,
                    director: input.director,
                    producer: input.producer,
                    synopsis: input.synopsis,
                    rating: input.rating,
                    status: MovieStatus.COMINGSOON,
                    //review: input.review
                    // showing added after initial creation
                    //createdAt and updatedAt already generate i think
                }
            });
            if (newMovie) {
                return newMovie
            } else {
                throw new Error('Failed to create new movie')
            }
        }),
    editMovie: publicProcedure
    // unused
        .input(
            z.object({
                id: z.string(),
                title: z.string().min(1, {message: 'Movie must have a title'}),
                category: z.string().min(1, {message: 'Movie must have a category'}),
                cast: z.string().min(1, {message: 'Movie must have a cast'}),
                director: z.string().min(1, {message: 'Movie must have a director'}),
                producer: z.string().min(1, {message: 'Movie must have a producer'}),
                synopsis: z.string().min(1, {message: 'Movie must have a synopsis'}),
                rating: z.string().min(1, {message: 'Movie must have a rating'}),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // patches all fields regardless of change, api call should supply all args
            // required arg is promo id, this field is passed to front end upon byID or getAllMovies
            const modifiedMovie = await ctx.prisma.movie.update({
                where: {
                    id: input.id
                },
                data: {
                    title: input.title,
                    category: input.category,
                    cast: input.cast,
                    director: input.director,
                    producer: input.producer,
                    synopsis: input.synopsis,
                    rating: input.rating,
                }
            });
            if (modifiedMovie) {
                return modifiedMovie
            } else {
                throw new Error('Issue updating movie details')
            }
        }),
    deleteMovie: publicProcedure
    // unused
        .input(
            z.object({
                id: z.string()   
            })
        )
        .mutation(async ({ ctx, input }) => {
            const deletedMovie = await ctx.prisma.movie.delete({
                where: {
                    id: input.id
                }
            });
            if (deletedMovie) {
                return deletedMovie
            } else {
                throw new Error('Issue finding or deleting movie. Try again in a minute.')
            }
        }),
    getAllMovies: publicProcedure
        .query(async ({ ctx }) => {
            const allMovies = await ctx.prisma.movie.findMany();
            if (allMovies) {
                return allMovies
            } else {
                throw new Error('No movies are currently available, or failed to fetch.')
            }
        }),
    byID: publicProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const foundMovie = await ctx.prisma.movie.findUnique({
                where: {
                    id: input.id
                }
            });
            if (foundMovie) {
                return foundMovie
            } else {
                throw new Error('No movie exists by this ID')
            }
        }),
    searchByKeyword: publicProcedure
            .input(
                z.object({
                    keyword: z.string().min(1, {message: 'Must provide at least one character when searching.'})
                })
            )
            .mutation(async ({ ctx, input }) => {
                // mutation, should be called upon search button click as to not mass query the db
                const foundMovies = await ctx.prisma.movie.findMany({
                    where: {
                        OR: [
                            {title: {
                                    contains: input.keyword
                                }},
                            {category: {
                                    contains: input.keyword
                                }},
                        ]
                    }
                });
                if (foundMovies) {
                    return foundMovies
                } else {
                    throw new Error('No movies were found with this keyword.')
                }
            }),
});