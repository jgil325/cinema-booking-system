import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";
import Navbar from "../components/navbar/Navbar";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <Component {...pageProps} />
      <div className="fixed bottom-0 mt-10 w-full bg-gray-200 py-8 text-center">
        © 2023 Cinema EBooking System. All rights reserved.
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
