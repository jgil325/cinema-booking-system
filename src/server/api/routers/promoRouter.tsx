import { createTRPCRouter, publicProcedure } from '../trpc'
import {z} from 'zod'
import { v4 as uuidv4 } from "uuid";
import nodemailer from 'nodemailer';

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
            const foundPromo = await ctx.prisma.promotion.findUnique({
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
            const allPromos = await ctx.prisma.promotion.findMany();
            if (allPromos) {
                return allPromos
            } else {
                throw new Error('No promotions are currently active')
            }
        }),
    editPromo: publicProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().min(1, {message: 'Promotion must have a title'}),
                description: z.string().min(1, {message: 'Promotion must have a description'}),
                discountPercent: z.number().gte(0, {message: 'Percentage must be greater than or equal to 0%'})
                    .lte(1, {message: 'Percentage must be less than or equal to 100%'}),
                discountCode: z.string().min(3, {message: 'Discount code must be 3 characters or greater'}),
                startDate: z.date().min(new Date(), {message: 'Promotion date cannot start prior to now'}),
                endDate: z.date().max(new Date('2024-01-01'), {message: 'Promotion end date must be before January 1st, 2024'})
            })
        )
        .mutation(async ({ ctx, input }) => {
            // patches all fields regardless of change, api call should supply all args
            // required arg is promo id, this field is passed to front end upon byID or getAllPromos
            const modifiedPromo = await ctx.prisma.promotion.update({
                where: {
                    id: input.id
                },
                data: {
                    title: input.title,
                    description: input.description,
                    discount: input.discountPercent,
                    code: input.discountCode,
                    startDate: input.startDate,
                    endDate: input.endDate
                }
            });
            if (modifiedPromo) {
                return modifiedPromo
            } else {
                throw new Error('Issue updating promotion details')
            }
        }),
    sendPromoEmail: publicProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            // callable query conditionally initiated after promo creation or otherwise
            const usersSignedUpForPromos = await ctx.prisma.user.findMany({
                where: {
                    isSignedUpPromos: true
                },
                select: {
                    email: true
                }
            });
            if (!usersSignedUpForPromos) {
                throw new Error('No users are signed up for promotions')
            }
            const promoDetails = await ctx.prisma.promotion.findUnique({
                where: {
                    id: input.id
                }
            });
            if (!promoDetails) {
                throw new Error('No promotion exists with provided ID')
            }
            var numberOfEmails = usersSignedUpForPromos.length || 0
            var numberOfSuccess = 0
            for (var user of usersSignedUpForPromos) {
                // async maybe?
                var email = user.email
                try {
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
                        subject: `Promotion (${promoDetails.code}): ${promoDetails.title}!`,
                        html: `${promoDetails.description}\n\nUse Code: ${promoDetails.code} 
                            for ${promoDetails.discount * 100}% off your next purchase!`
                    };
                    transporter.sendMail(mailOptions, function(error: any, info: { response: any; }) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(`Promotion Email sent to ${email}.`);
                        }
                    });
                    numberOfSuccess+=1
                } catch {
                    throw new Error('Failed to send promotion email to '+ email);
                    // dont interrupt email loop please
                }
            }
            return `Successfully sent ${numberOfSuccess} out of ${numberOfEmails} promotion emails`;
        }),
});