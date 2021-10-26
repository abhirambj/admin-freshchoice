import React from "react";
import { useCookies } from "react-cookie";
import { createPopper } from "@popperjs/core";
import { deleteToken } from "../pages/api/apiRequests";
import { useRouter } from "next/router";
import HashLoader from "react-spinners/HashLoader";
import { useState } from "react";
import changePassword from "../pages/api/POST/ChangePassword";
import { DropDownContext } from "../Contexts/DropDownContext";

const Dropdown = () => {
  const [cookie, setCookie, removeCookie] = useCookies(["user"]);
  // dropdown props
  const [showModal, setShowModal] = React.useState(false);
  const [baseUrl] = useState("https://immense-castle-52645.herokuapp.com");
  const [showModal1, setShowModal1] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [dropdownPopoverShow, setDropdownPopoverShow] =
    React.useContext(DropDownContext);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const router = useRouter();

  const [data, setData] = useState({
    old_password: "",
    password: "",
    password2: "",
    success: false,
  });

  const [error, setError] = useState({
    ERRold_password: true,
    ERRpassword: true,
    ERRpassword2: true,
  });
  const { ERRold_password, ERRpassword, ERRpassword2 } = error;

  const handleBlur = (name) => (event) => {
    let simplifiedName = name.replace("ERR", "");
    setError({ ...error, [name]: data[simplifiedName] ? true : false });
  };

  const { old_password, password, password2, success } = data;

  const handleChange = (name) => (event) => {
    setError({ ...error, ["ERR" + name]: true });
    setData({ ...data, [name]: event.target.value.toString() });
  };

  const openDropdownPopover = (ev) => {
    ev.stopPropagation();
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const handlePassword = (ev) => {
    ev.preventDefault();
    setLoading(true);
    if (!old_password || !password || !password2) {
      console.log("No");
      return;
    } else if (password != password2 || old_password == password) {
      console.log("Password is same as Old one");
    } else {
      changePassword(data, baseUrl + "/user/me/chpwd").then((data) => {
        if (data) {
          if (data.error || data.detail) {
            console.log("Error", data.err);
            setLoading(false);
          } else {
            console.log("Success Post req");
          }
        } else {
          console.log("No DATA");
          setLoading(false);
        }
      });
    }
  };
  return (
    <>
      <div>
        <div className="flex flex-wrap">
          <div className="w-full sm:w-6/12 md:w-6/12 px-4">
            <div className="relative inline-flex align-middle w-full">
              <button
                className="py-4 text-white font-bold text-sm hover:shadow-lg outline-none focus:outline-none active: ease-linear transition-all duration-150"
                type="button"
                ref={btnDropdownRef}
                onClick={(ev) => {
                  dropdownPopoverShow
                    ? closeDropdownPopover()
                    : openDropdownPopover(ev);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="white"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div
                ref={popoverDropdownRef}
                className={
                  (dropdownPopoverShow ? "block " : "hidden ") +
                  "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1 min-w-48"
                }
              >
                <a
                  href="#pablo"
                  className="text-sm py-2 px-10 font-normal block w-full whitespace-no-wrap bg-transparent text-red"
                  onClick={() => setShowModal(true)}
                >
                  Change Password
                </a>
                <a
                  href="#pablo"
                  className="text-sm py-2 px-20 font-normal block w-full whitespace-no-wrap bg-transparent text-red"
                  onClick={() => {
                    setShowModal1(true);
                  }}
                >
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-sm">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-red-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Change Password</h3>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <div class="mb-3 pt-0">
                      <input
                        type="password"
                        name="old_password"
                        onChange={handleChange("old_password")}
                        onBlur={handleBlur("ERRold_password")}
                        placeholder="Old Password"
                        class="px-3 py-3 placeholder-black text-black relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                      />
                    </div>
                    <div class="mb-3 pt-0">
                      <input
                        type="password"
                        name="password"
                        onChange={handleChange("password")}
                        onBlur={handleBlur("ERRpassword")}
                        placeholder="New Password"
                        class="px-3 py-3 placeholder-black text-black relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                      />
                    </div>
                    <div class="mb-3 pt-0">
                      <input
                        type="password"
                        name="password2"
                        onChange={handleChange("password2")}
                        onBlur={handleBlur("ERRpassword2")}
                        placeholder="Confirm Password"
                        class="px-3 py-3 placeholder-black text-black relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                      />
                    </div>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-red-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handlePassword}
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
        {showModal1 ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-sm">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-red-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Logout</h3>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <div class="mb-3 pt-0">
                      <p className="text-red font-bold">
                        Do you wish to Logout of this account?
                      </p>
                    </div>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-red-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal1(false)}
                    >
                      No
                    </button>
                    <button
                      className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {
                        setLoading(true);
                        deleteToken(removeCookie);
                        router.push("/");
                        setLoading(false);
                      }}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Dropdown;
