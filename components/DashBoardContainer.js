import React from "react";
import { useContext } from "react";
import { DropDownContext } from "../Contexts/DropDownContext";
import { NavContext } from "../Contexts/NavContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashBoardContainer = ({ children }) => {
  console.log(useContext(NavContext));
  const [isActive, setIsActive] = useContext(NavContext);
  const [dropdownPopoverShow, setDropdownPopoverShow] =
    useContext(DropDownContext);
  return (
    <div
      className="w-auto overflow-hidden"
      onClick={() => setDropdownPopoverShow(false)}
    >
      <Navbar />
      <div
        className="flex flex-row"
        onClick={() => {
          setDropdownPopoverShow(false);
          setIsActive(false);
        }}
      >
        <Sidebar />
        <div className="flex-1 overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
};

export default DashBoardContainer;
