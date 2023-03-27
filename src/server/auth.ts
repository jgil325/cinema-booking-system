import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  Session,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../env.mjs";
import { prisma } from "./db";
import CredentialsProvider from "next-auth/providers/credentials";
import { StatusType } from "@prisma/client";
import { boolean, z } from 'zod';
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts"; // uses bcrypt-ts instead of bcrypt
/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: "test",
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "login",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email Address",
          type: "email",
          placeholder: "john.doe@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your super secure password",
        },
      },
      async authorize(credentials) {
        // TODO find correct user and decrypt password and stuff
        const { email, password } = credentials || {};

        if (!email || !password) {
          console.log("Email and password are required")
          throw new Error("Email and password are required");
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
          where: { email } 
        });
        if (!user) {
          console.log("Could not find user with that email address.")
          throw new Error("Could not find user with that email address.")
        }
        const passwordMatch = compareSync(password, user.password) // uses bcrypt-ts
        if (!passwordMatch) {
          console.log("Invalid password.")
          throw new Error("Invalid password");
        }
        if (user.statusType == StatusType.INACTIVE) {
          console.log("User email has not been verified yet. Please verfiy your email.")
          throw new Error("User email has not been verified yet. Please verfiy your email.");
        }
        if (user.statusType == StatusType.SUSPENDED) {
          console.log("Your account has been suspended.")
          throw new Error("Your account has been suspended.");
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (!user) {
        throw new Error("Invalid email or password.");
      }
      return true;
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async session({ session, token, user }) {
      console.log(token);
      if (token && token.email) {
        const userInfo = await prisma.user.findFirst({
          where: { email: token.email },
        });
        return {
          ...session,
          user: {
            ...session.user,
            ...userInfo,
            //id: token.id as string,
            // role: token.role as string,
          },
        };
      }
      const sess: Session = {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          // role: token.role as string,
        },
      };

      return sess;
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
