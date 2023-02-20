import React from "react";
import { useRouter } from "next/router";
// import { faFilm } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

let temporaryLoginStatus = false; // later with global log in context

const NavLink = (props: any) => {
  return (
    <button
      onClick={props.switchRoute}
      className="m-4 rounded bg-sky-50 py-2 px-4 font-bold text-black hover:bg-sky-200"
    >
      {props.linkName}
    </button>
  );
};

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 bg-cyan-800 shadow-2xl">
      <div className="mr-6 flex flex-row justify-between space-x-6">
        {/* <FontAwesomeIcon
          icon={faFilm}
          size="3x"
          className="ml-6 mt-3 text-white"
        ></FontAwesomeIcon> */}
        <div className="gap-30 align-end flex flex-row space-x-6">
          <NavLink switchRoute={() => router.push("/")} linkName="Home" />
          <NavLink linkName="Browse Movies" />
          {temporaryLoginStatus ? (
            <NavLink
              switchRoute={() => router.push("/profile")}
              linkName="Profile"
            />
          ) : (
            <NavLink
              switchRoute={() => router.push("/login")}
              linkName="Login"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
