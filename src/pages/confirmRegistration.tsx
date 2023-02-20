import React from "react";
import { useRouter } from "next/router";

const confirmRegistration = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-xl font-bold">Registration Confirmed</h2>
        <p className="mb-4">
          Thank you for registering! You should receive a confirmation email
          shortly.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        >
          Continue to Login
        </button>
      </div>
    </div>
  );
};

export default confirmRegistration;
