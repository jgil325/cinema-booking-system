import React from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { signIn } from "next-auth/react";

let temporaryLoginStatus = false; // later with global log in context

const NavLink = (props: any) => {
  return (
    <button className="m-4 rounded bg-sky-50 py-2 px-4 font-bold text-black hover:bg-sky-200">
      {props.linkName}
    </button>
  );
};

const Navbar = () => {
  const router = useRouter();

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
          <button
            className="my-4 rounded bg-sky-50 py-2 px-4 font-bold text-black hover:bg-sky-200"
            onClick={() => signIn()}
          >
            Sign In
          </button>

          {/* {temporaryLoginStatus ? (
            <NavLink
              switchRoute={() => router.push("/profile")}
              linkName="Profile"
            />
          ) : (
            <NavLink
              switchRoute={() => router.push("/signIn")}
              linkName="Sign In"
            />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
