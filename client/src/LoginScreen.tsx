import React, { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { useLocation, useNavigate } from "react-router";
import { useAppDispatch } from "./store";
import { login } from "./features/auth/authSlice";

enum FormType {
  Login,
  Register,
}

export const LoginScreen: React.FC = () => {
  const [currentForm, setCurrentForm] = useState(FormType.Login);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (username: string, password: string) => {
    await dispatch(login({ username, password }));
    if (location.state?.from && login.fulfilled.match) {
      navigate(location.state.from);
    } else navigate("/");
  };
  const handleRegister = async (username: string, password: string) => {};

  return (
    <div className="min-w-screen flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="min-w-[340px]">
        {currentForm === FormType.Login ? (
          <LoginForm
            onRegisterClick={() => setCurrentForm(FormType.Register)}
            handleLogin={handleLogin}
          />
        ) : (
          <RegisterForm onLoginClick={() => setCurrentForm(FormType.Login)} />
        )}
      </div>
    </div>
  );
};
