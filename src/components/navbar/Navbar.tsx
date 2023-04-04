import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const signOutHandler = async () => {
    // redirects to home page then signs out
    await router.push("/");
    await signOut();
  };
  return (
    <div className="shadow-b sticky top-0 z-50 border-b border-gray-400 bg-blue-700 shadow-xl">
      <div className="align-end mr-6 flex flex-row justify-between space-x-6">
        <div className="gap-30 flex flex-row space-x-8">
          <Link href={"/"}>
            <FontAwesomeIcon
              icon={faFilm}
              size="3x"
              className="ml-6 mt-3 text-white hover:cursor-pointer hover:text-sky-200"
            />
          </Link>
          <Link href={"/"}>
            <button className="my-4 rounded bg-sky-50 py-2 px-4 font-bold text-black hover:bg-sky-200">
              Home
            </button>
          </Link>
          <Link href={"/"}>
            <button className="my-4 rounded bg-sky-50 py-2 px-4 font-bold text-black hover:bg-sky-200">
              Browse Movies
            </button>
          </Link>
          {session?.user.role === "ADMIN" ? (
            <Link href={"/admin"}>
              <button className="my-4 rounded bg-sky-50 py-2 px-4 font-bold text-black hover:bg-sky-200">
                Admin
              </button>
            </Link>
          ) : null}
        </div>
        {session ? (
          <div className="gap-30 flex flex-row space-x-8">
            <button
              className="my-4 rounded bg-sky-50 py-2 px-4 font-bold text-black hover:bg-sky-200"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={signOutHandler}
            >
              Sign Out
            </button>
            <Link href={"/yourProfile"}>
              <button className="my-4 rounded bg-sky-50 py-2 px-4 font-bold text-black hover:bg-sky-200">
                Your Profile
              </button>
            </Link>
          </div>
        ) : (
          <div className="gap-30 flex flex-row space-x-8">
            <Link href={"/register"}>
              <button className="my-4 rounded bg-sky-50 py-2 px-4 font-bold text-black hover:bg-sky-200">
                Create Account
              </button>
            </Link>
            <Link href={"/signIn"}>
              <button className="my-4 rounded bg-sky-50 py-2 px-4 font-bold text-black hover:bg-sky-200">
                Sign In
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
