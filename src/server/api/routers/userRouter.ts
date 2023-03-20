import { createTRPCRouter, publicProcedure } from '../trpc'
import {z} from 'zod'
import { v4 as uuidv4 } from 'uuid';
import { StatusType } from '@prisma/client';
import validator from 'validator';


export const userRouter = createTRPCRouter({

    all: publicProcedure.query(({ ctx }) => {
      return ctx.prisma.user.findMany({ orderBy: { id: "desc" } });
    }),
    byId: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(({ ctx, input }) => {
        return ctx.prisma.user.findFirst({ where: { id: input.id } });
      }),
    createAccount: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          firstName: z.string().min(1, {message: "Name is required"}),
          lastName: z.string().min(1, {message: "Last name is required"}),
          password: z.string().min(8, {message: "Length must be at least 8 characters long."}), // .includes(string) TODO: ensure that password has combination of uppercase, lowercase, and symbols
          isSignedUpPromos: z.boolean(),
          phoneNumber: z.string().refine(validator.isMobilePhone, {message: "Please enter a valid phone number."})
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const {email, firstName, lastName, password, isSignedUpPromos, phoneNumber} = input;

        let existingUser;
        
        try {
          existingUser = await ctx.prisma.user.findFirst({
            where: { email },
        });
        } catch (error) {
          throw new Error(`Failed to check for existing user. Cannot Create User with checking for existing user. Try again.`);
        }
        
        if (existingUser) {
          throw new Error('A user with this email already exists!'); // TODO: I dont want this to go to the next page, rn it goes to the confirmation page.
        }

        try { // dont know how to catch zod inputs

        } catch (error) {

        }

        const encodedPassword = Buffer.from(password).toString('base64'); // is this chill?

        // can call payment router here If i wanted to

        const fullUserDetails = { 
            id: uuidv4(), // unique
            password: encodedPassword,
            email: email,
            firstName: firstName,
            lastName: lastName,
            isSignedUpPromos: isSignedUpPromos,
            phoneNumber: phoneNumber,
            statusType: StatusType.INACTIVE,
            Account: {
                create: [{
                  id: uuidv4(), // unique
                  type: 'user',
                  provider: 'credentials', // compositionally unique
                  providerAccountId: uuidv4(), // unique, This this might need to be obtained from somewhere
                  refresh_token: null,
                  access_token: null,
                  expires_at: null,
                  token_type: null,
                  scope: null,
                  id_token: null,
                  session_state: null
                }]
              },
            Session: {
                create: [
                    {
                        sessionToken: uuidv4(), // unique
                        expires: new Date('2023-11-31T23:59:59Z'),
                    }
                ]
            }
             
        };

        let createdUser;

        try {
          createdUser = await ctx.prisma.user.create({ data: fullUserDetails }); 
        } catch (error) {
          throw new Error(`Failed to create user.`);
        }

        const userID = createdUser.id;
        const activationLink = `http://localhost:3000/confirmRegistration?userID=${userID}`;
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
          subject: 'Account Creation Confirmation',
          html: `Congrats! You have signed up for an cinema ebooking system account. Promotions coming soon! Please click on the link to activate you account: <a href="${activationLink}">${activationLink}</a>`
        };
        
        transporter.sendMail(mailOptions, function(error: any, info: { response: any; }) {
          if (error) {
            console.log(error);
          } else {
            console.log(`Confirmation Email sent to ${email}.` + info.response);
          }
        });
        return createdUser;
      }),
    delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
      return ctx.prisma.user.delete({ where: { id: input } });
    }),
  });