import React from 'react';
import { useRouter } from 'next/router';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
      <div className="flex flex-row space-x-6 justify-between mr-6">
        <FontAwesomeIcon icon={faFilm} size="3x" className='text-white ml-6 mt-3'></FontAwesomeIcon>
        <div className='flex flex-row space-x-6 gap-30'>
          <NavLink switchRoute={() => router.push("/")} linkName="Home"/>
          <NavLink linkName="Browse Movies"/>
          { 
            temporaryLoginStatus ?
              <NavLink switchRoute={() => router.push("/profile")} linkName="Profile"/> : 
              <NavLink switchRoute={() => router.push("/login")} linkName="Login"/>
          }
        </div>
      </div>
    </div>
  );
};

export default Navbar;