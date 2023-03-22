import { createTRPCRouter, publicProcedure } from '../trpc'
import {z} from 'zod'
import { CardType } from '@prisma/client';
import { TRPCError } from '@trpc/server';


const sendUpdateEmail = (email: string) => {
    try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({  
            service: 'Gmail',
            auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
            }
        });
        
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Account Information Update',
            html: 'Successfully updated profile information!'
        };
        
        transporter.sendMail(mailOptions, function(error: any, info: { response: any; }) {
            if (error) {
            console.log(error);
            } else {
            console.log(`Profile Update Confirmation Email sent to ${email}.`);
            }
        });
        return {
            message: 'successfully sent email!',
            email: email
        }
    } catch {
        return new TRPCError({
            code: 'CONFLICT',
            message: 'failed sending email'
        })
    }
}

export const editProfileRouter = createTRPCRouter({
    sendConfirmEmail: publicProcedure
    // written as a query so an email isnt sent for each individual field updated
        .query(async ({ ctx }) => {
            const sendEmail = ctx.session?.user.email;
            console.log(sendEmail);
            return sendUpdateEmail(sendEmail || 'collinsr2k@gmail.com');
        }),
    /*getUserInfo: publicProcedure
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
                        homeAddress: true,
                        homeCity: true,
                        homeState: true,
                        homeZipCode: true,
                        paymentCards: {
                            where: {
                                userId: userID
                            },
                            select: {
                                id: true,
                                cardNumber: true, // for now just the encrypted number is fine
                                cardType: true,
                                expirationMonth: true,
                                expirationYear: true,
                                billingAddress: true,
                                billingCity: true,
                                billingState: true,
                                billingZipCode: true,
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
        }),*/
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
                sendUpdateEmail(ctx.session?.user.email || '');
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
    changeFirstName: publicProcedure
        .input(
            z.object({
                newFirstName: z.string()
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const userID = ctx.session?.user.id;
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID,
                    },
                    data: {
                        firstName: input.newFirstName
                    }
                })
                sendUpdateEmail(ctx.session?.user.email || '');
                return(
                    {
                        status: 'success',
                        operation: 'change first name',
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
    changeLastName: publicProcedure
        .input(
            z.object({
                newLastName: z.string()
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const userID = ctx.session?.user.id;
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID,
                    },
                    data: {
                        lastName: input.newLastName
                    }
                })
                sendUpdateEmail(ctx.session?.user.email || '');
                return(
                    {
                        status: 'success',
                        operation: 'change last name',
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
                sendUpdateEmail(ctx.session?.user.email || '');
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
                sendUpdateEmail(ctx.session?.user.email || '');
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
                        homeAddress: input.newStreetName
                    }
                });
                sendUpdateEmail(ctx.session?.user.email || '');
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
                        homeCity: input.newCityName
                    }
                });
                sendUpdateEmail(ctx.session?.user.email || '');
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
                        homeState: input.newStateName
                    }
                });
                sendUpdateEmail(ctx.session?.user.email || '');
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
                        homeZipCode: input.newZipName
                    }
                });
                sendUpdateEmail(ctx.session?.user.email || '');
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
                newStreetName: z.string(),
                cardId: z.string()
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
                            update: {
                                where: {
                                    id: input.cardId
                                },
                                data: {
                                    billingAddress: input.newStreetName
                                }
                            }
                        }
                    }
                })
                sendUpdateEmail(ctx.session?.user.email || '');
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
    changeBillingCity: publicProcedure
        .input(
            z.object({
                newCityName: z.string(),
                cardId: z.string()
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
                            update: {
                                where: {
                                    id: input.cardId
                                },
                                data: {
                                    billingCity: input.newCityName
                                }
                            }
                        }
                    }
                })
                sendUpdateEmail(ctx.session?.user.email || '');
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
                newStateName: z.string(),
                cardId: z.string()
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
                            update: {
                                where: {
                                    id: input.cardId
                                },
                                data: {
                                    billingState: input.newStateName
                                }
                            }
                        }
                    }
                })
                sendUpdateEmail(ctx.session?.user.email || '');
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
                newZipCode: z.string(),
                cardId: z.string()
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
                            update: {
                                where: {
                                    id: input.cardId
                                },
                                data: {
                                    billingZipCode: input.newZipCode
                                }
                            }
                        }
                    }
                })
                sendUpdateEmail(ctx.session?.user.email || '');
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
    changeCardType: publicProcedure
        .input(
            z.object({
                newCardType: z.nativeEnum(CardType),
                cardId: z.string()
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
                            update: {
                                where: {
                                    id: input.cardId
                                },
                                data: {
                                    cardType: input.newCardType
                                }
                            }
                        }
                    }
                })
                sendUpdateEmail(ctx.session?.user.email || '');
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
                newCardExpirationMonth: z.number(),
                newCardExpirationYear: z.number(),
                cardId: z.string()
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
                            update: {
                                where: {
                                    id: input.cardId
                                },
                                data: {
                                    expirationMonth: input.newCardExpirationMonth
                                }
                            }
                        }
                    }
                })
                const updateUser1 = await ctx.prisma.user.update({
                    where: {
                        id: userID
                    },
                    data: {
                        paymentCards: {
                            update: {
                                where: {
                                    id: input.cardId
                                },
                                data: {
                                    expirationYear: input.newCardExpirationYear
                                }
                            }
                        }
                    }
                })
                sendUpdateEmail(ctx.session?.user.email || '');
                return(
                    {
                        status: 'success',
                        operation: 'change billing card expiration date',
                        newUser: updateUser1
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
                newCardNumber: z.string().length(16),
                cardId: z.string()
            }))
        .mutation(async ({ ctx, input }) => {
            try {
                const userID = ctx.session?.user.id;
                const bcrypt = require('bcrypt');
                const encryptedCardNumber = await bcrypt.hash(input.newCardNumber, 10);
                const updateUser = await ctx.prisma.user.update({
                    where: {
                        id: userID
                    },
                    data: {
                        paymentCards: {
                            update: {
                                where: {
                                    id: input.cardId
                                },
                                data: {
                                    cardNumber: encryptedCardNumber
                                }
                            }
                        }
                    }
                })
                sendUpdateEmail(ctx.session?.user.email || '');
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