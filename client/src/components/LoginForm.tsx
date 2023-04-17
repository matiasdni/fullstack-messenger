import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../store";

interface Props {
  onRegisterClick: () => void;
  handleLogin: (username: string, password: string) => void;
}

export const LoginForm: React.FC<Props> = ({
  onRegisterClick,
  handleLogin,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  return (
    <div className="container max-w-sm grow">
      <form
        onSubmit={handleSubmit}
        className="form-input border-0 bg-blue-50 py-[16px] shadow-md ring-2 ring-neutral-200 dark:border-collapse  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:shadow-2xl dark:ring-0"
      >
        <h3 className="mb-4 text-2xl font-bold">Sign in to your account</h3>
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
            placeholder="Username     "
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block  w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
            required
            autoComplete="off"
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 transition-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <div className="mb-2 h-full w-full p-2">
          <div className="inline-flex w-full justify-between">
            <div className="mb-2 text-sm">
              <input
                id="remember"
                type="checkbox"
                value=""
                className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800 dark:active:bg-gray-700"
              />

              <label
                htmlFor="remember"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>
            <Link to="/forgot-password">
              <div className="justify-end text-sm text-blue-700 hover:underline dark:text-blue-500">
                <span>Lost Password?</span>
              </div>
            </Link>
          </div>
        </div>
        <div className="my-6">
          <button
            // disabled={loading}
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="submit"
          >
            Sign In
          </button>
        </div>
        <div className="mt-20 font-sans text-sm text-gray-500 dark:text-gray-300">
          <p className="space-x-1">
            <span>Not registered?</span>
            <Link
              type="button"
              to="/register"
              onClick={onRegisterClick}
              className="text-blue-700 hover:underline dark:text-blue-500"
            >
              <span>Create account</span>
            </Link>
          </p>
        </div>
      </form>
      <p className="mt-2 text-center text-xs text-gray-500">
        &copy;2023 matiasdn. All rights reserved.
      </p>
    </div>
  );
};
