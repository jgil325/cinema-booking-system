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
    <div className="flex h-screen items-center justify-center">
      <h1 className="mx-10 mb-4 rounded-lg bg-white p-6 text-center text-3xl font-medium shadow-md">
        Login
      </h1>
      <LoginForm onSubmit={handleSubmit}></LoginForm>
    </div>
  );
};

export default login;
