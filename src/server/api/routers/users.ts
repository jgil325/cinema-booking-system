import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getAllUsers: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        yourInputText: input.text,
      };
    }),
});
