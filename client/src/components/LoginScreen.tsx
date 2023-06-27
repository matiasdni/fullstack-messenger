import { useAppDispatch } from "@/app/store";
import { login } from "@/features/auth/authSlice";
import { getChats } from "@/features/chats/chatsSlice";
import { setNotification } from "@/features/notification/notificationSlice";
import api from "@/services/api";
import { isFulfilled } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

enum FormType {
  Login,
  Register,
}

export const LoginScreen: React.FC = () => {
  const [currentForm, setCurrentForm] = useState(FormType.Login);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (username: string, password: string) => {
    dispatch(login({ username, password })).then((action) => {
      if (isFulfilled(action)) {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${action.payload.token}`;
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
      }
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="inline-flex py-20 px-10 rounded-2xl bg-neutral-100">
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold text-start w-full">
            Welcome to Fullstack Messenger
          </h2>
          <p className="text-lg text-gray-500">
            A chat app built with React, Redux, and Tailwind, socket.io, and
            more!
          </p>
        </div>
        <div className="w-px h-96 bg-gray-300 dark:bg-gray-700 mx-8"></div>
        <div className="flex flex-col items-center justify-center w-[448px]">
          {currentForm === FormType.Login ? (
            <LoginForm
              onRegisterClick={() => setCurrentForm(FormType.Register)}
              navigate={navigate}
              handleSubmit={handleSubmit}
            />
          ) : (
            <RegisterForm onLoginClick={() => setCurrentForm(FormType.Login)} />
          )}
        </div>
      </div>
    </div>
  );
};
