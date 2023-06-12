import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { login } from "@/features/auth/authSlice";
import { isFulfilled } from "@reduxjs/toolkit";
import { useNavigate } from "react-router";
import { getChats } from "@/features/chats/chatsSlice";
import { setNotification } from "features/notification/notificationSlice";

export const LoginForm = ({ onRegisterClick }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ username, password }))
      .then((action) => {
        if (isFulfilled(action)) {
          dispatch(getChats(action.payload.token)).then((action) => {
            if (isFulfilled(action)) {
              navigate("/");
              dispatch(
                setNotification({
                  message: "Login successful",
                  status: "success",
                })
              );
            }
          });
        } else {
          throw new Error("Login failed");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="form-input m-auto max-w-md rounded-lg border-0 bg-blue-50 py-[16px] shadow-md ring-1 dark:border-collapse  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:shadow-2xl dark:ring-0"
      >
        {/* input fields */}
        <div className="flex flex-col gap-4 p-4 md:p-8">
          <header>
            <h3 className="text-2xl font-bold">Sign in to your account</h3>
          </header>
          <div>
            <label
              htmlFor="login-username"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>
            <input
              id="login-username"
              type="text"
              placeholder="Username     "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="Password"
              autoComplete={"current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 transition-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          {/* buttons etc */}
          <div className="h-full w-full">
            <div className="inline-flex w-full justify-between">
              <div className="space-x-2 text-sm">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800 dark:active:bg-gray-700"
                />

                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-gray-900 dark:text-gray-300"
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
          <div className="">
            <button
              // disabled={loading}
              className="h-10 w-full rounded-lg bg-blue-700 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="submit"
            >
              Sign In
            </button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-300">
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
        </div>
      </form>
      <p className="mt-2 text-center text-xs text-gray-500">
        &copy;2023 matiasdn. All rights reserved.
      </p>
    </>
  );
};
