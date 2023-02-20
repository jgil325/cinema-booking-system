import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useRouter } from "next/router";

const RegisterForm = () => {
  const router = useRouter();

  return (
    <Tabs.Root
      className="flex w-[300px] flex-col rounded-lg bg-white shadow-md"
      defaultValue="tab1"
    >
      <Tabs.List
        className="border-mauve6 flex shrink-0 border-b"
        aria-label="Manage your account"
      >
        <Tabs.Trigger
          className="hover:text-violet11 data-[state=active]:text-violet11 flex 
        h-[45px] flex-1 cursor-default select-none items-center 
        justify-center bg-white px-5 
        text-[15px] leading-none text-gray-700 outline-none 
        first:rounded-tl-md last:rounded-tr-md 
        data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] 
        data-[state=active]:shadow-current 
        data-[state=active]:focus:relative 
        data-[state=active]:focus:shadow-[0_0_0_2px] 
        data-[state=active]:focus:shadow-black"
          value="tab1"
        >
          Account Info
        </Tabs.Trigger>
        <Tabs.Trigger
          className="hover:text-violet11 data-[state=active]:text-violet11
         flex h-[45px] flex-1 
         cursor-default select-none items-center justify-center 
         bg-white px-5 text-[15px] leading-none text-gray-700 
         outline-none first:rounded-tl-md last:rounded-tr-md 
         data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]
          data-[state=active]:shadow-current data-[state=active]:focus:relative 
          data-[state=active]:focus:shadow-[0_0_0_2px] 
          data-[state=active]:focus:shadow-black"
          value="tab2"
        >
          Password
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        className="grow rounded-b-md bg-white p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
        value="tab1"
      >
        <p className="text-mauve11 mb-5 text-[15px] leading-normal">
          Set your account details here.
        </p>
        <fieldset className="mb-[15px] flex w-full flex-col justify-start">
          <label
            className="text-violet12 mb-2.5 block text-[13px] leading-none"
            htmlFor="name"
          >
            Email
          </label>
          <input
            className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
            id="Email"
            defaultValue="example@gmail.com"
          />
        </fieldset>
        <fieldset className="mb-[15px] flex w-full flex-col justify-start">
          <label
            className="text-violet12 mb-2.5 block text-[13px] leading-none"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
            id="username"
            defaultValue="@example"
          />
        </fieldset>
        <div className="mt-5 flex justify-end">
          <button className="w-full rounded-lg bg-indigo-500 py-2 px-4 font-medium text-white hover:bg-indigo-700">
            Confirm
          </button>
        </div>
      </Tabs.Content>
      <Tabs.Content
        className="grow rounded-b-md bg-white p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
        value="tab2"
      >
        <p className="text-mauve11 mb-5 text-[15px] leading-normal">
          Set your password here.
        </p>
        <fieldset className="mb-[15px] flex w-full flex-col justify-start">
          <label
            className="text-violet12 mb-2.5 block text-[13px] leading-none"
            htmlFor="newPassword"
          >
            Set password
          </label>
          <input
            className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
            id="newPassword"
            type="password"
          />
        </fieldset>
        <fieldset className="mb-[15px] flex w-full flex-col justify-start">
          <label
            className="text-violet12 mb-2.5 block text-[13px] leading-none"
            htmlFor="confirmPassword"
          >
            Confirm password
          </label>
          <input
            className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
            id="confirmPassword"
            type="password"
          />
        </fieldset>
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => router.push("/confirmRegistration")}
            className="w-full rounded-lg bg-indigo-500 py-2 px-4 font-medium text-white hover:bg-indigo-700"
          >
            Submit
          </button>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default RegisterForm;
