import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/userRouter";
import { paymentRouter } from "./routers/paymentRouter";
import { activateRouter } from "./routers/activateRouter";
import { editProfileRouter } from "./routers/editProfileRouter";
import { promoRouter } from "./routers/admin/promoRouter";
import { manageUsersRouter } from "./routers/admin/manageUsers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  paymentCard: paymentRouter,
  activateUser: activateRouter,
  editProfile: editProfileRouter,
  promos: promoRouter,
  manageUsers: manageUsersRouter,
});

export type AppRouter = typeof appRouter;
