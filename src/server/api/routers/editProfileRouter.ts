import { createTRPCRouter, publicProcedure } from '../trpc'
import {z} from 'zod'
import { v4 as uuidv4 } from 'uuid';
import { CardType, StatusType } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export const editProfileRouter = createTRPCRouter({
    getUserInfo: publicProcedure
        .query(async ({ ctx }) => {
            const userID = ctx.session?.user.id;
            try {
                const userInfo = await ctx.prisma.user.findUnique({
                    where: {
                        id: userID
                    },
                    select: {
                        firstName: true,
                        lastName: true,
                        paymentCards: {
                            where: {
                                userId: userID
                            },
                            select: {
                                homeAddress: true,
                                homeCity: true,
                                homeState: true,
                                homeZipCode: true,
                                billingAddress: true,
                                cardNumber: true,
                                // more fields need to be added
                            }
                        }
                    }
                })
                return ({
                    status: 'successful fetch',
                    payload: userInfo
                });
            } catch {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Error fetching user data',
                });
            } 
        }),
    changePromoStatus: publicProcedure
        .input(
            z.object({
                newPromoStatus: z.boolean() // TRUE indicates they want promos, FALSE indicates they do not want promos
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const userID = ctx.session?.user.id;
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID,
                    },
                    data: {
                        isSignedUpPromos: input.newPromoStatus
                    }
                })
                return(
                    {
                        status: 'success',
                        operation: 'changed promotion status',
                        newUser: updateUser
                    }
                );
            } catch {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Error changing promotion status!',
                });
            }
        }),
    changeName: publicProcedure
        .input(
            z.object({
                newName: z.string()
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const [ newFirstName, newLastName ] = input.newName.split(" ", 2);
                const userID = ctx.session?.user.id;
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID,
                    },
                    data: {
                        firstName: newFirstName,
                        lastName: newLastName 
                    }
                })
                return(
                    {
                        status: 'success',
                        operation: 'change first and last name',
                        newUser: updateUser
                    }
                );
            } catch {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Error updating users new name!',
                });
            }
        }),
    changePhoneNumber: publicProcedure
        .input(
            z.object({
                newPhoneNumber: z.string().length(9)
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const userID = ctx.session?.user.id;
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID,
                    },
                    data: {
                        phoneNumber: input.newPhoneNumber
                    }
                })
                return(
                    {
                        status: 'success',
                        operation: 'change phone number',
                        newUser: updateUser
                    }
                );
            } catch {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Error updating users new phone number!',
                });
            }
        }),
    changePassword: publicProcedure
        .input(
            z.object({
                newPassword: z.string(),
                oldPassword: z.string()
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const userID = ctx.session?.user.id;
                const findUserPassword = await ctx.prisma.user.findUnique({
                    where: {
                        id: userID
                    },
                    select: {
                        password: true
                    }
                })
                const bcrypt = require('bcrypt');
                const compare = await bcrypt.compare(input.oldPassword, findUserPassword?.password);
                if (!compare) {
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: 'non matching passwords'
                    })
                }
                const encodedPassword = await bcrypt.hash(input.newPassword, 10);
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID,
                    },
                    data: {
                        password: encodedPassword
                    }
                })
                return(
                    {
                        status: 'success',
                        operation: 'change password',
                        newUser: updateUser
                    }
                );
            } catch {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Error updating users new password!',
                });
            }
        }),
    changeHomeStreet: publicProcedure
        .input(
            z.object({
                newStreetName: z.string()
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const userID = ctx.session?.user.id;
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID
                    },
                    data: {
                        paymentCards: {
                            updateMany: {
                                where: {
                                    userId: userID // does this reference the right user??
                                },
                                data: {
                                    homeAddress: input.newStreetName
                                }
                            }
                        }
                    }
                })
                return(
                    {
                        status: 'success',
                        operation: 'change home street',
                        newUser: updateUser
                    }
                );
            } catch {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Error updating users home street!',
                });
            }
        }),
    changeHomeCity: publicProcedure
        .input(
            z.object({
                newCityName: z.string()
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const userID = ctx.session?.user.id;
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID
                    },
                    data: {
                        paymentCards: {
                            updateMany: {
                                where: {
                                    userId: userID // does this reference the right user??
                                },
                                data: {
                                    homeCity: input.newCityName
                                }
                            }
                        }
                    }
                })
                return(
                    {
                        status: 'success',
                        operation: 'change home city',
                        newUser: updateUser
                    }
                );
            } catch {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Error updating users home city!',
                });
            }
        }),
    changeHomeState: publicProcedure
        .input(
            z.object({
                newStateName: z.string()
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const userID = ctx.session?.user.id;
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID
                    },
                    data: {
                        paymentCards: {
                            updateMany: {
                                where: {
                                    userId: userID // does this reference the right user??
                                },
                                data: {
                                    homeState: input.newStateName
                                }
                            }
                        }
                    }
                })
                return(
                    {
                        status: 'success',
                        operation: 'change home state',
                        newUser: updateUser
                    }
                );
            } catch {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Error updating users home state!',
                });
            }
        }),
    changeHomeZipCode: publicProcedure
        .input(
            z.object({
                newZipName: z.string().length(5)
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const userID = ctx.session?.user.id;
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID
                    },
                    data: {
                        paymentCards: {
                            updateMany: {
                                where: {
                                    userId: userID // does this reference the right user??
                                },
                                data: {
                                    homeZipCode: input.newZipName
                                }
                            }
                        }
                    }
                })
                return(
                    {
                        status: 'success',
                        operation: 'change home zip code',
                        newUser: updateUser
                    }
                );
            } catch {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Error updating users home zip code!',
                });
            }
        }),
    changeBillingAddress: publicProcedure
        .input(
            z.object({
                newStreetName: z.string()
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const userID = ctx.session?.user.id;
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID
                    },
                    data: {
                        paymentCards: {
                            updateMany: {
                                where: {
                                    userId: userID // does this reference the right user??
                                },
                                data: {
                                    billingAddress: input.newStreetName
                                }
                            }
                        }
                    }
                })
                return(
                    {
                        status: 'success',
                        operation: 'change billing address',
                        newUser: updateUser
                    }
                );
            } catch {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Error updating users billing address!',
                });
            }
        }),
    // Is there a different billing city, state, zip?
    changeBillingCity: publicProcedure
        .input(
            z.object({
                newCityName: z.string()
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const userID = ctx.session?.user.id;
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID
                    },
                    data: {
                        paymentCards: {
                            updateMany: {
                                where: {
                                    userId: userID // does this reference the right user??
                                },
                                data: {
                                    homeCity: input.newCityName
                                }
                            }
                        }
                    }
                })
                return(
                    {
                        status: 'success',
                        operation: 'change billing city',
                        newUser: updateUser
                    }
                );
            } catch {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Error updating users billing city!',
                });
            }
        }),
    changeBillingState: publicProcedure
        .input(
            z.object({
                newStateName: z.string()
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const userID = ctx.session?.user.id;
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID
                    },
                    data: {
                        paymentCards: {
                            updateMany: {
                                where: {
                                    userId: userID // does this reference the right user??
                                },
                                data: {
                                    homeState: input.newStateName
                                }
                            }
                        }
                    }
                })
                return(
                    {
                        status: 'success',
                        operation: 'change billing state',
                        newUser: updateUser
                    }
                );
            } catch {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Error updating users billing state!',
                });
            }
        }),
    changeBillingZipCode: publicProcedure
        .input(
            z.object({
                newZipCode: z.string()
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const userID = ctx.session?.user.id;
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID
                    },
                    data: {
                        paymentCards: {
                            updateMany: {
                                where: {
                                    userId: userID // does this reference the right user??
                                },
                                data: {
                                    homeZipCode: input.newZipCode
                                }
                            }
                        }
                    }
                })
                return(
                    {
                        status: 'success',
                        operation: 'change billing zip code',
                        newUser: updateUser
                    }
                );
            } catch {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Error updating users billing zip code!',
                });
            }
        }),
    // ^^^^^^ //
    changeCardType: publicProcedure
        .input(
            z.object({
                newCardType: z.nativeEnum(CardType)
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const userID = ctx.session?.user.id;
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID
                    },
                    data: {
                        paymentCards: {
                            updateMany: {
                                where: {
                                    userId: userID // does this reference the right user??
                                },
                                data: {
                                    cardType: input.newCardType
                                }
                            }
                        }
                    }
                })
                return(
                    {
                        status: 'success',
                        operation: 'change billing card type',
                        newUser: updateUser
                    }
                );
            } catch {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Error updating users billing card type!',
                });
            }
        }),
    changeCardExpiration: publicProcedure
        .input(
            z.object({
                newCardExpirationDate: z.string() // needs to be Date type
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const userID = ctx.session?.user.id;
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID
                    },
                    data: {
                        paymentCards: {
                            updateMany: {
                                where: {
                                    userId: userID // does this reference the right user??
                                },
                                data: {
                                    cardNumber: input.newCardExpirationDate // needs to be Expiration DateType
                                }
                            }
                        }
                    }
                })
                return(
                    {
                        status: 'success',
                        operation: 'change billing card expiration date',
                        newUser: updateUser
                    }
                );
            } catch {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Error updating users billing card expiration date!',
                });
            }
        }),
    changeCardNumber: publicProcedure
        .input(
            z.object({
                newCardNumber: z.string().length(16)
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const userID = ctx.session?.user.id;
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID
                    },
                    data: {
                        paymentCards: {
                            updateMany: {
                                where: {
                                    userId: userID // does this reference the right user??
                                },
                                data: {
                                    cardNumber: input.newCardNumber
                                }
                            }
                        }
                    }
                })
                return(
                    {
                        status: 'success',
                        operation: 'change billing card number',
                        newUser: updateUser
                    }
                );
            } catch {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Error updating users billing card number!',
                });
            }
        }),
});