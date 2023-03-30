import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/userRouter";
import { paymentRouter } from "./routers/paymentRouter";
import { activateRouter } from "./routers/activateRouter";
import { editProfileRouter } from "./routers/editProfileRouter";
import { promoRouter } from "./routers/promoRouter";
import { manageUsersRouter } from "./routers/manageUsers";
import { moviesRouter } from "./routers/moviesRouter";
import { showingsRouter } from "./routers/showingsRouter";

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
  movies: moviesRouter,
  showings: showingsRouter,
});

export type AppRouter = typeof appRouter;
