"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <div className="w-full">
      <ul className="bg-[#F4EEE0] h-auto py-5 md:py-0 flex shadow-md flex-wrap justify-center items-center text-center gap-8 rounded-2xl my-12 mx-12 md:h-14">
        {session && session.user && (
          <>
            <Link href={"/"}>
              <li className="rounded-lg shadow-sm text-[#F4EEE0] font-bold bg-[#6D5D6E] px-8 py-2">
                Home
              </li>
            </Link>
            <button onClick={() => signOut()}>
              {" "}
              <li className="rounded-lg shadow-sm text-[#F4EEE0] font-bold bg-[#6D5D6E] px-8 py-2">
                SignOut
              </li>
            </button>
          </>
        )}
        {!session && (
          <Link href={"/signin"}>
            {" "}
            <li className="rounded-lg shadow-sm text-[#F4EEE0] font-bold bg-[#6D5D6E] px-8 py-2">
              SignIn
            </li>
          </Link>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
