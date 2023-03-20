import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/userRouter";
import { paymentRouter } from "./routers/paymentRouter";
import { activateRouter } from "./routers/activateRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  paymentCard: paymentRouter,
  activateUser: activateRouter,
});

export type AppRouter = typeof appRouter;
