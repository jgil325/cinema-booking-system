import Link from "next/link";
import React, { useState } from "react";
import { api } from "../utils/api";
import { z, ZodError } from 'zod';
import { TRPCError } from "@trpc/server";
import { TRPCClientError } from "@trpc/client";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const sendReset = api.user.sendPasswordResetLink.useMutation();

  const verifyEmail = z.object({
    email: z.string().email({ message: 'Please provide a valid email address'})
  })

  const handleChangePassClick = async () => {
    try {
      const result = verifyEmail.parse({email: email})
      const change = await sendReset.mutateAsync({ email });
      setEmailSent(true);
    } catch (err) {
      if (err instanceof ZodError) {
        console.log(err.flatten().fieldErrors.email)
        alert('Error: '+err.flatten().fieldErrors.email)
      } else if (err instanceof TRPCClientError) {
        console.log(err.message)
        alert('Error: '+err.message)
      } else {
        console.log('unknown error, debug this')
        alert('unknown error, debug this')
      }
    }
  }

  return (
    <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform">
      <div className="flex justify-center">
        <div className="border-grey grid w-1/3 grid-cols-1 items-center justify-center rounded-xl border px-12 py-8 text-center">
          <span className="my-3 text-2xl font-medium">Forgot Password</span>

          {emailSent ? (
            <>
              <div className="mb-3">
                You should recieve an email shortly sent to {email}. Please
                follow the instructions provided there.
              </div>
              <button
                onClick={() => setEmailSent(false)}
                className="mb-1 w-full rounded-lg bg-indigo-500 py-2 px-4 font-medium text-white hover:bg-indigo-700"
              >
                Send Another Email
              </button>
            </>
          ) : (
            <>
              <input
                className="my-3 rounded border border-gray-400 bg-gray-50  px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                type="text"
                id="email"
                placeholder="Email Address"
                defaultValue=""
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleChangePassClick}
                className="mb-1 w-full rounded-lg bg-indigo-500 py-2 px-4 font-medium text-white hover:bg-indigo-700"
              >
                Change Password
              </button>
              <Link href="/signIn" className="my-3">
                <span className="font-sm text-sm text-gray-900 hover:cursor-pointer hover:text-gray-500">
                  Back to Login
                </span>
          </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
