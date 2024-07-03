"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const router = useRouter();
  const { data: session } = useSession();

  if (session && session.user) {
    router.push("/");
    return;
  }

  return (
    <button
      className="bg-[#F4EEE0] shadow-md text-[#4F4557] text-center px-5 py-6 rounded-lg font-bold text-2xl"
      onClick={() => signIn("google")}
    >
      <span className="flex justify-center items-center gap-5">
        <Image src={"/google.svg"} alt="Google logo" width={30} height={30} />{" "}
        Sign in with GOOGLE
      </span>
    </button>
  );
};

export default SignIn;
