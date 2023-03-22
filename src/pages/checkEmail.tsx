import Link from "next/link";
import React from "react";

const checkEmail = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-xl font-bold">Account Registered</h2>
        <p className="mb-4">
          To complete registration, please follow the link sent to your email to
          activate your account.
        </p>
        <div>
          <p className="text-sm text-gray-400">Already Confirmed Email?</p>
          <Link href="/signIn">
            <button className="w-full rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
              Continue to Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default checkEmail;
