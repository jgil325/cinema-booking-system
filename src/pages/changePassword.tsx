import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { api } from "../utils/api";
const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const { uid } = router.query;

  const { mutate } = api.editProfile.resetPassword.useMutation();
  console.log(uid)
  function handleChangePass() {
    if (password.localeCompare(confirmPassword) !== 0)
      return window.alert("Passwords must match");
    mutate({ newPassword: password, uid });
    setShowSuccess(true);
  }

  if (showSuccess)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-96 rounded bg-white p-8 shadow-md">
          <h2 className="mb-4 text-xl font-bold">
            Changed Password Successfully
          </h2>
          <Link href="/signIn">
            <button className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
              Continue to Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  return (
    <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform">
      <div className="flex justify-center">
        <div className="border-grey grid w-1/3 grid-cols-1 items-center justify-center space-y-3 rounded-xl border px-12 py-8 text-center">
          <span className="text-2xl font-medium">Change Password</span>
          <input
            className="rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            type="password"
            id="email"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            type="password"
            id="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            className="w-full rounded-lg bg-indigo-500 py-2 px-4 font-medium text-white hover:bg-indigo-700"
            type="submit"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={handleChangePass}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
