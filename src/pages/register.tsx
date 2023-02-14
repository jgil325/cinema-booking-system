import React from "react";
import RegisterForm from "../components/RegisterForm";

const register = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="mx-10 mb-4 rounded-lg bg-white p-6 text-center text-3xl font-medium shadow-md">
        Register
      </h1>
      <RegisterForm />
    </div>
  );
};

export default register;
