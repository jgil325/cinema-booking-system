import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // pass to auth so session token only stored if remember me checked
  const router = useRouter();
  const { data: session } = useSession();

  function redirect(location: string) {
    void router.push(location);
  }

  if (session)
    session?.user?.role !== "ADMIN" ? redirect("/") : redirect("/admin");

  async function doSignIn() {
    try {
      const signInResult = await signIn("login", {
        email,
        password,
        redirect: false,
      });
      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      await router.push("/");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link href="/forgotPassword">
            <span className="font-sm text-sm text-gray-900 hover:cursor-pointer hover:text-gray-500">
              Forgot Password?
            </span>
          </Link>

          <button
            className="w-full rounded-lg bg-indigo-500 py-2 px-4 font-medium text-white hover:bg-indigo-700"
            type="submit"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={doSignIn}
          >
            Login
          </button>
          <div className="flex justify-between">
            <div className="select-none">
              <input
                type="checkbox"
                id="rememberMe"
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 border-gray-900 bg-gray-50 hover:cursor-pointer hover:border-gray-500"
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

export default SignIn;
