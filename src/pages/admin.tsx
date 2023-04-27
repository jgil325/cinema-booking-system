import { useSession } from "next-auth/react";
import { useState } from "react";
import AccessDenied from "../components/AccessDenied";
import ManageMovies from "../components/admin/ManageMovies";
import { ManagePromotions } from "../components/admin/ManagePromotions";
import ManageFees from "../components/admin/ManageFees";
import ManageUsers from "../components/admin/ManageUsers";

const Admin = () => {
  // REPLACE THIS WITH USER GROUP ISNT ADMIN OR USER NOT LOGGED IN
  const [tab, setTab] = useState<"movies" | "users" | "promos" | "fees">("movies");

  const { data: session } = useSession();
  if (session?.user?.role !== "ADMIN")
    return <AccessDenied message="You must be an admin to access this page" />;

  return (
    <>
      <div className="mt-4 px-8">
        <div className="w-full space-y-0 rounded-xl border py-4 px-4 text-center">
          <span className="text-center text-3xl font-medium">Admin Panel</span>
          <div className="grid grid-cols-4 space-x-4 px-3 py-4">
            <button
              className={`${
                tab === "movies" ? "ring-4 ring-black " : "hover:bg-indigo-700 "
              }h-fit rounded-lg bg-indigo-500 px-3 py-1.5 font-medium text-white`}
              type="submit"
              onClick={() => setTab("movies")}
            >
              Manage Movies
            </button>
            <button
              className={`${
                tab === "users" ? "ring-4 ring-black " : "hover:bg-indigo-700 "
              }h-fit rounded-lg bg-indigo-500 px-3 py-1.5 font-medium text-white `}
              type="submit"
              onClick={() => setTab("users")}
            >
              Manage Users
            </button>
            <button
              className={`${
                tab === "promos" ? "ring-4 ring-black " : "hover:bg-indigo-700 "
              }h-fit rounded-lg bg-indigo-500 px-3 py-1.5 font-medium text-white `}
              type="submit"
              onClick={() => setTab("promos")}
            >
              Manage Promotions
            </button>
            <button
              className={`${
                tab === "fees" ? "ring-4 ring-black " : "hover:bg-indigo-700 "
              }h-fit rounded-lg bg-indigo-500 px-3 py-1.5 font-medium text-white `}
              type="submit"
              onClick={() => setTab("fees")}
            >
              Manage Fees
            </button>
          </div>
        </div>
        <div className="mt-4 w-full space-y-0 rounded-xl border py-4 px-4 text-center">
          {tab === "movies" ? <ManageMovies /> : null}
          {tab === "users" ? <ManageUsers /> : null}
          {tab === "promos" ? <ManagePromotions /> : null}
          {tab === "fees" ? <ManageFees /> : null}
        </div>
      </div>
    </>
  );
};

export default Admin;
