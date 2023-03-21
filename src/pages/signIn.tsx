import Link from "next/link";
import React from "react";
import LoginForm from "../components/forms/LoginForm";

const login = () => {
  const handleSubmit = (username: string, password: string) => {
    console.log(`Submitting login credentials:`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    // Perform actual login logic here
  };

  return (
    <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform">
      <div className="flex justify-center">
        <div className="border-grey grid w-1/3 grid-cols-1 items-center justify-center space-y-3 rounded-xl border px-12 py-8 text-center">
          <span className="text-2xl font-medium">Sign In</span>
          <input
            className="rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            type="text"
            id="email"
            placeholder="Email Address"
          />
          <input
            className="rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            type="password"
            id="password"
            placeholder="Password"
          />
          <Link href="/forgotPassword">
            <span className="font-sm text-sm text-gray-900 hover:cursor-pointer hover:text-gray-500">
              Forgot Password?
            </span>
          </Link>

          <button
            className="w-full rounded-lg bg-indigo-500 py-2 px-4 font-medium text-white hover:bg-indigo-700"
            type="submit"
          >
            Login
          </button>
          <div className="flex justify-between">
            <div className="select-none">
              <input
                type="checkbox"
                id="rememberMe"
                className="h-4 w-4 bg-gray-50 hover:cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="font-sm pl-1.5 align-top text-sm text-gray-900 hover:cursor-pointer hover:text-gray-500"
              >
                Remember Me
              </label>
            </div>
            <Link href="/register">
              <span className="font-sm text-sm text-gray-900 hover:cursor-pointer hover:text-gray-500">
                Create Account
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default login;
