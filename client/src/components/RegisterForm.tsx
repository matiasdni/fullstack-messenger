import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUser } from "../services/user";

interface Props {
  onLoginClick: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onLoginClick }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = {
      username,
      password,
    };

    const response = await createUser(user);

    if (response.status === 201) {
      onLoginClick();
    } else {
      // display error message to user
      console.log(response);
    }
  };

  return (
    <div className="container max-w-sm grow">
      <form
        onSubmit={handleSubmit}
        className="form-input border-0 bg-blue-50 py-[16px] shadow-md ring-2 ring-neutral-200 dark:border-collapse  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:shadow-2xl dark:ring-0"
      >
        <h5 className="mb-4 text-2xl font-bold">Create an account</h5>
        <div className="p-2">
          <label
            htmlFor="login-username"
            className="block py-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Username
          </label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <div className="p-2">
          <label
            htmlFor="login-password"
            className="block py-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 transition-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <div className="my-6">
          <button
            // disabled={loading}
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="submit"
          >
            Register
          </button>
        </div>
        <div className="hei mt-20 font-sans text-sm text-gray-500 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            type="button"
            to="/login"
            onClick={onLoginClick}
            className="text-blue-700 hover:underline dark:text-blue-500"
          >
            Sign In
          </Link>
        </div>
      </form>
      <p className="mt-2 text-center text-xs text-gray-500">
        &copy;2023 matiasdn.
      </p>
    </div>
  );
};
