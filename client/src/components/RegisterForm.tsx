import React, { useState } from "react";
import { Link } from "react-router-dom";
import { newUser } from "../services/user";

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

    const response = await newUser(user);

    if (response.status === 201) {
      onLoginClick();
    } else {
      // display error message to user
      console.log(response);
    }
  };

  return (
    <div className="container grow max-w-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-blue-50 py-[16px] form-input border-0 ring-2 ring-neutral-200 shadow-md dark:ring-0  dark:border-collapse dark:bg-gray-800 dark:shadow-2xl dark:border-gray-700 dark:text-gray-300"
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white transition-none"
          />
        </div>
        <div className="my-6">
          <button
            // disabled={loading}
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="submit"
          >
            Register
          </button>
        </div>
        <div className="text-sm mt-20 font-sans hei text-gray-500 dark:text-gray-300">
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
      <p className="text-center mt-2 text-gray-500 text-xs">
        &copy;2023 matiasdn.
      </p>
    </div>
  );
};
