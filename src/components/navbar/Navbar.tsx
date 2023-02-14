import React from 'react';
import { useRouter } from 'next/router';

let temporaryLoginStatus = false; // later with global log in context 

const NavLink = (props: any) => {
  return (
    <button onClick={props.switchRoute} className='bg-sky-50 hover:bg-sky-200 text-black font-bold py-2 px-4 rounded m-4'>{props.linkName}</button>
  );
}

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="bg-cyan-800 shadow-2xl sticky top-0 z-50">
      <div className="flex flex-row space-x-6 justify-end gap-30 mr-6">
      <NavLink switchRoute={() => router.push("/")} linkName="Home"/>
      <NavLink linkName="Browse Movies"/>
      { 
        temporaryLoginStatus ?
          <NavLink linkName="Profile"/> : 
          <NavLink switchRoute={() => router.push("/login")} linkName="Login"/>
      }
      </div>
    </div>
  );
};

export default Navbar;