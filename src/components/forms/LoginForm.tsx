import React, { useState } from "react";
import * as z from "zod";

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
      password: z.string().required(),
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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        {usernameError && <div>{usernameError}</div>}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {passwordError && <div>{passwordError}</div>}
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
