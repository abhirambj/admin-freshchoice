import Dropdown from '../components/Dropdown';
import Link from 'next/link';
import { useContext, useState } from 'react';
import Sidebar from './Sidebar';
import {NavContext} from '../Contexts/NavContext';
import { DropDownContext } from '../Contexts/DropDownContext';

const Navbar = () => {
  const [isActive,setIsActive] = useContext(NavContext);
  const [dropdownPopoverShow, setDropdownPopoverShow] = useContext(DropDownContext);
  return (
      <>
        <nav onClick={() => setIsActive(false)} className="z-10 font-sans flex flex-col text-center sm:flex-row sm:text-left sm:justify-between py-1 px-6 bg-red-700 shadow sm:items-baseline w-full">
        <div className="flex flex-row items-center mb-2 sm:mb-0">
        <button
            className="mobile-menu-button p-4 focus:outline-none focus:bg-red-700"
            onClick={ev => {
              ev.stopPropagation();
              setDropdownPopoverShow(false)
              setIsActive(!isActive);}}
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Link href="/dashboard">
            <a className="block text-2xl no-underline text-white hover:text-red-300 pl-2">FreshChoice</a>
            </Link>
        </div>
        <div onClick={() => setIsActive(false)} className="space-y-6 md:space-x-2 md:space-y-0">
          <Dropdown />  
        </div>
        </nav>
      </>
  )
}

export default Navbar