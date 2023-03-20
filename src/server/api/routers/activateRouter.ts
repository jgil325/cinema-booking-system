import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';
import { StatusType } from '@prisma/client';

export const activateRouter = createTRPCRouter({
  activate: publicProcedure
    .input(
      z.object({
        userID: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userID } = input;

      try {
        // Update user status to ACTIVE
        const updatedUser = await ctx.prisma.user.update({
          where: { id: userID },
          data: { statusType: StatusType.ACTIVE },
        });

        console.log(`User ${updatedUser.id} activated successfully.`);

        return updatedUser;
      } catch (error) {
        console.error(`Error activating user ${userID}:`, error);
        throw new Error(`Failed to activate user ${userID}.`);
      }
    }),
});