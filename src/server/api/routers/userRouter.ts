import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { StatusType, UserRole, CardType } from "@prisma/client";
import validator from "validator";
import { TRPCError } from "@trpc/server";
import nodemailer from "nodemailer";
//import bcrypt from "bcrypt";
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";

export const userRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({ orderBy: { id: "desc" } });
  }),
  byId: publicProcedure.query(async ({ ctx }) => {
    const userID = ctx.session?.user.id;
    const foundUser = await ctx.prisma.user.findUnique({
      where: {
        id: userID,
      },
    });
    return foundUser;
  }),
  createAccount: publicProcedure
    .input(
      /*z.object({
        // User Validation
        email: z.string().email(),
        firstName: z.string().min(1, { message: "Name is required" }),
        lastName: z.string().min(1, { message: "Last name is required" }),
        password: z
          .string()
          .min(8, { message: "Length must be at least 8 characters long." }), // .includes(string) TODO: ensure that password has combination of uppercase, lowercase, and symbols
        isSignedUpPromos: z.boolean(),
        phoneNumber: z
          .string()
          .refine(validator.isMobilePhone, {
            message: "Please enter a valid phone number.",
          }),
        homeAddress: z.string().min(1, { message: "Home address is required" }),
        homeCity: z.string().min(1, { message: "Home city is required" }),
        homeState: z.string().min(1, { message: "Home state is required" }),
        homeZipCode: z
          .string()
          .length(5, { message: "Please enter a valid zip code." }),
        //Payment Validation
        cardNumber: z
          .union([z.string().refine((value) => validator.isCreditCard(value), {
            message: "Please enter a valid credit card number.",
          }), z.string().length(0)])
          .optional()
          .transform(e => e === "" ? undefined : e),
        cardType: z.enum(["VISA", "MASTERCARD", "DISCOVER", "AMEX"]),
        billingAddress: z
          .union([z.string().max(100), z.string().length(0)])
          .optional()
          .transform(e => e === "" ? undefined : e),
        expirationMonth: z
          .union([z.number().min(1, { message: "Please enter a valid month." }).max(12, { message: "Please enter a valid month." }), z.number().optional()]),
        expirationYear: z
          .union([z.number().min(1, { message: "Please enter a valid expiration year." }), z.number().optional()]),
        billingCity: z
          .union([z.string().min(1, { message: "Please enter a valid city." }), z.string().length(0)])
          .optional()
          .transform(e => e === "" ? undefined : e),
        billingState: z
          .union([z.string().min(1), z.string().length(0)])
          .optional()
          .transform(e => e === "" ? undefined : e),
        billingZipCode: z
          .union([z.string().length(5, { message: "Please enter a valid zip code."}), z.string().length(0)])
          .optional()
          .transform(e => e === "" ? undefined : e),
      })
      .refine((value) => {
        if (
          (!value.cardNumber && !value.billingAddress && !value.expirationMonth && !value.expirationYear && !value.billingCity && !value.billingState && !value.billingZipCode) ||
          (value.cardNumber && value.billingAddress && value.expirationMonth && value.expirationYear && value.billingCity && value.billingState && value.billingZipCode)
        ) {
          return true;
        }
        throw new Error('All payment fields are required if you want to add a payment card. \nPlease remove all data from fields if you do not want to create a payment card.')
      }),*/
      z.object({ // same sanitation as front end, needs better billing options which are likely above
        email: z.string().email({message: 'Invalid email address'}),
        firstName: z.string().min(1,{message: 'Invalid first name'}),
        lastName: z.string().min(1,{message: 'Invalid last name'}),
        phoneNumber: z.string().length(10,{message: 'Invalid phone number'}),
        homeAddress: z.string().min(1,{message: 'Invalid home address'}),
        homeCity: z.string().min(1,{message: 'Invalid home city'}),
        homeState: z.string().min(1,{message: 'Invalid home state'}),
        homeZipCode: z.string().length(5,{message: 'Invalid home zip code'}),
        isSignedUpPromos: z.boolean(),
    
        cardType: z.union([z.enum(["Select Card", "VISA", "MASTERCARD", "DISCOVER", "AMEX"],), z.literal("")]),
        cardNumber: z.union([z.string().min(16,{message: 'Invalid card number'}), z.literal("")]),
        expirationMonth: z.union([z.string().min(1,{message: 'Invalid expiration month'}), z.literal("")]),
        expirationYear: z.union([z.string().length(4,{message: 'Invalid expiration year'}), z.literal("")]),
        billingAddress: z.union([z.string().min(1), z.literal("")]),
        billingCity: z.union([z.string().min(1), z.literal("")]),
        billingState: z.union([z.string().min(1), z.literal("")]),
        billingZipCode: z.union([z.string().length(5), z.literal("")]),
    
        password: z.string().min(1,{message: 'Invalid password'}),
        confirmPassword: z.string().min(1,{message: 'Invalid confirm password'})
      })
      .refine((value) => { // actually fuck this method but whatever
        if ((value.cardType=='Select Card')&&(value.cardNumber=="")&&(value.expirationMonth=="")&&(value.expirationYear=="")&&
          (value.billingAddress=="")&&(value.billingCity=="")&&(value.billingState=="")&&(value.billingZipCode=="")) {
            return true
          } else if ((value.cardType!='Select Card')&&(value.cardNumber!="")&&(value.expirationMonth!="")&&(value.expirationYear!="")&&
          (value.billingAddress!="")&&(value.billingCity!="")&&(value.billingState!="")&&(value.billingZipCode!="")) {
            return true
          } else {
            return false
          }
      }, {message: 'All payment info fields must be filled in or none of them!'})      
    )
    
    .mutation(async ({ ctx, input }) => {
      const {
        email,
        firstName,
        lastName,
        password,
        isSignedUpPromos,
        phoneNumber,
        homeAddress,
        homeCity,
        homeState,
        homeZipCode,
      } = input; // User info
      const {
        cardNumber,
        cardType,
        billingAddress,
        expirationMonth,
        expirationYear,
        billingCity,
        billingState,
        billingZipCode,
      } = input; // payment info
      // might already be or should be moved to zod schema
      /*try {
        // Validate home address, city, state, and zip code
        if (!homeAddress.trim()) {
          throw new Error("Home address is required");
        }
        if (!homeCity.trim()) {
          throw new Error("City is required");
        }
        if (!homeState.trim()) {
          throw new Error("State is required");
        }
        if (!homeZipCode.trim()) {
          throw new Error("Zip code is required");
        }
        if (!/^[0-9]{5}$/.test(homeZipCode.trim())) {
          throw new Error("Zip code must be a 5-digit number");
        }
      } catch (error) {
        console.error("Error creating payment info:", error);
        throw new Error(
          "Could not create payment info. Check billing information."
        );
      }*/

      let existingUser;

      try {
        existingUser = await ctx.prisma.user.findFirst({
          where: { email },
        });
      } catch (error) {
        throw new Error(
          `Failed to check for existing user. Cannot Create User with checking for existing user. Try again.`
        );
      }

      if (existingUser) {
        throw new Error("A user with this email already exists!"); // TODO: I dont want this to go to the next page, rn it goes to the confirmation page.
      }

      //const encodedPassword = await bcrypt.hash(password, 10);
      const hashedPassword = hashSync(password, genSaltSync(10))

      const fullUserDetails = {
        id: uuidv4(), // unique
        password: hashedPassword,
        email: email,
        firstName: firstName,
        lastName: lastName,
        isSignedUpPromos: isSignedUpPromos,
        phoneNumber: phoneNumber,
        statusType: StatusType.INACTIVE,
        homeAddress: homeAddress,
        homeCity: homeCity,
        homeState: homeState,
        homeZipCode: homeZipCode,
        role: UserRole.CUSTOMER,
        Account: {
          create: [
            {
              id: uuidv4(), // unique
              type: "user",
              provider: "credentials", // compositionally unique
              providerAccountId: uuidv4(), // unique, This this might need to be obtained from somewhere
              refresh_token: null,
              access_token: null,
              expires_at: null,
              token_type: null,
              scope: null,
              id_token: null,
              session_state: null,
            },
          ],
        },
        Session: {
          create: [
            {
              sessionToken: uuidv4(), // unique
              expires: new Date("2023-11-31T23:59:59Z"),
            },
          ],
        },
      };
      let createdCard;
      if (cardType != 'Select Card') { // indicates no payment card added
        const paymentCardDetails = {
          cardNumber: cardNumber,
          cardType: CardType.VISA, // because enums are messed up right now
          billingAddress: billingAddress, // TODO: Build and Validate building address, // TODO: make sure their can only be one shipping address
          expirationMonth: Number(expirationMonth),
          expirationYear: Number(expirationYear),
          billingCity: billingCity,
          billingState: billingState,
          billingZipCode: billingZipCode,
          userId: fullUserDetails.id,
        };

        try { // need to only create a payment card if there is information to create a payment card
          createdCard = await ctx.prisma.paymentCard.create({
            data: paymentCardDetails
          });
          console.log("Creating payment card on registration of account.")
        } catch (error) {
          throw new Error("Failed to create payment card.");
        }
        
      }

      let createdUser;
      try {
        createdUser = await ctx.prisma.user.create({ data: fullUserDetails });
      } catch (error) {
        throw new Error(`Failed to create user.`);
      }

      const userID = createdUser.id;
      const activationLink = `http://localhost:3000/confirmRegistration?userID=${userID}`;

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Account Creation Confirmation",
        html: `Congrats! You have signed up for an cinema ebooking system account. Promotions coming soon! Please click on the link to activate you account: <a href="${activationLink}">${activationLink}</a>`,
      };

      transporter.sendMail(
        mailOptions,
        function (error, info: { response: any }) {
          if (error) {
            console.log(error);
          } else {
            console.log(`Confirmation Email sent to ${email}.`, info.response);
          }
        }
      );
      return [createdUser,createdCard];
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.user.delete({ where: { id: input } });
  }),
  validateLogin: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const userFound = await ctx.prisma.user.findFirst({
          where: {
            email: input.email,
          },
        });
        if (userFound) {
          const dbUserPass = userFound.password;
          const compare = compareSync(input.password, dbUserPass);
          if (!compare) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "non matching passwords",
            });
          }
          return {
            status: "success",
            data: {
              userFound,
            },
          };
        }
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "user not found or other err",
        });
      }
    }),
  sendPasswordResetLink: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: input.email,
          },
          select: {
            id: true,
          },
        });
        const activationLink = `http://localhost:3000/changePassword?uid=${user}`;

        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.MAIL_USER,
          to: input.email,
          subject: "Reset Password Request",
          html: `You have requested to reset your email. Follow provided link: <a href="${activationLink}">${activationLink}</a>`,
        };

        transporter.sendMail(
          mailOptions,
          function (error, info: { response: any }) {
            if (error) {
              console.log(error);
            } else {
              console.log(
                `Reset Password Email sent to ${input.email}.`,
                info.response
              );
            }
          }
        );
      } catch {
        return "error";
      }
    }),
});
