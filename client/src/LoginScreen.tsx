import React, { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";

enum FormType {
  Login,
  Register,
}

export interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = () => {
  const [currentForm, setCurrentForm] = useState(FormType.Login);

  const onLogin = () => {
    console.log("Login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-md">
        {currentForm === FormType.Login ? (
          <LoginForm
            onRegisterClick={() => setCurrentForm(FormType.Register)}
            onLogin={onLogin}
          />
        ) : (
          <RegisterForm onLoginClick={() => setCurrentForm(FormType.Login)} />
        )}
      </div>
    </div>
  );
};
