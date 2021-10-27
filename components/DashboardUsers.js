import Link from "next/link";
import { useState } from "react";
import { HashLoader } from "react-spinners";

const DashboardUsers = ({ orders, items, messages, users }) => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <HashLoader color={"FF0000"} loading={loading} size={150} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/orders">
            <div className="p-4 items-stretch content-between flex flex-col justify-between transition-shadow border rounded-lg shadow-sm hover:shadow-xl bg-red-700">
              <div className="flex items-center justify-between">
                <div className="">
                  <span className="pl-3 text-5xl font-bold text-white">
                    {orders}
                  </span>
                </div>
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 transform hover:scale-125 transition duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="bg-grey-lighter font-bold text-lg text-white p-3 flex items-center justify-between transition hover:bg-grey-light">
                Orders
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 transform hover:scale-125 transition duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </div>
          </Link>
          <Link href="/catalog">
            <div className=" p-4 items-stretch content-between flex flex-col justify-between transition-shadow border rounded-lg shadow-sm hover:shadow-xl bg-red-700">
              <div className="flex items-center justify-between">
                <div className="">
                  <span className="pl-3 text-5xl font-bold text-white">
                    {items}
                  </span>
                </div>
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 transform hover:scale-125 transition duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
              </div>
              <div className="bg-grey-lighter font-bold text-lg text-white p-3 flex items-center justify-between transition hover:bg-grey-light">
                Catalog
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 transform hover:scale-125 transition duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </div>
          </Link>
          <Link href="/messages">
            <div className=" p-4 content-between items-stretch flex flex-col justify-between transition-shadow border rounded-lg shadow-sm hover:shadow-xl bg-red-700">
              <div className="flex items-center justify-between">
                <div className="">
                  <span className="pl-3 text-5xl font-bold text-white">
                    {messages}
                  </span>
                </div>
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 transform hover:scale-125 transition duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
              </div>
              <div className="bg-grey-lighter font-bold text-lg text-white p-3 flex items-center justify-between transition hover:bg-grey-light">
                Messages
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 transform hover:scale-125 transition duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </div>
          </Link>
          <Link href="/users">
            <div className=" p-4 content-between items-stretch flex flex-col justify-between transition-shadow border rounded-lg shadow-sm hover:shadow-xl bg-red-700">
              <div className="flex items-center justify-between">
                <div className="">
                  <span className="pl-3 text-5xl font-bold text-white">
                    {users}
                  </span>
                </div>
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 transform hover:scale-125 transition duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="bg-grey-lighter font-bold text-lg text-white p-3 flex items-center justify-between transition hover:bg-grey-light">
                Users
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 transform hover:scale-125 transition duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default DashboardUsers;
