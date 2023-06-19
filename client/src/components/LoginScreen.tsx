import { login } from "@/features/auth/authSlice";
import { getChats } from "@/features/chats/chatsSlice";
import { setNotification } from "@/features/notification/notificationSlice";
import api from "@/services/api";
import { useAppDispatch } from "@/store";
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
    <>
      {currentForm === FormType.Login ? (
        <LoginForm
          onRegisterClick={() => setCurrentForm(FormType.Register)}
          navigate={navigate}
          handleSubmit={handleSubmit}
        />
      ) : (
        <RegisterForm onLoginClick={() => setCurrentForm(FormType.Login)} />
      )}
    </>
  );
};
