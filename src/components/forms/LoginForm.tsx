import React, { useState } from "react";
import { z } from "zod";

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUsernameError("");
    setPasswordError("");

    const schema = z.object({
      username: z.string().required(),
      password: z.string().min(8).required(),
    });

    const values = { username, password };
    const validated = schema.validate(values);

    if (validated.error) {
      validated.error.details.forEach((error) => {
        if (error.path[0] === "username") {
          setUsernameError(error.message);
        } else if (error.path[0] === "password") {
          setPasswordError(error.message);
        }
      });
      return;
    }

    onSubmit(username, password);
  };

  return (
    <form className="rounded-lg bg-white p-6 shadow-md" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          className="mb-2 block font-medium text-gray-700"
          htmlFor="username"
        >
          Username:
        </label>
        <input
          className="w-full rounded-lg border border-gray-400 p-2"
          type="text"
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        {usernameError && (
          <div className="mt-2 text-xs text-red-500">{usernameError}</div>
        )}
      </div>
      <div className="mb-4">
        <label
          className="mb-2 block font-medium text-gray-700"
          htmlFor="password"
        >
          Password:
        </label>
        <input
          className="w-full rounded-lg border border-gray-400 p-2"
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {passwordError && (
          <div className="mt-2 text-xs text-red-500">{passwordError}</div>
        )}
      </div>
      <button
        className="w-full rounded-lg bg-indigo-500 py-2 px-4 font-medium text-white hover:bg-indigo-700"
        type="submit"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
