import React, { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";

enum FormType {
  Login,
  Register,
}

export const LoginScreen: React.FC = () => {
  const [currentForm, setCurrentForm] = useState(FormType.Login);

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="min-w-[340px]">
        {currentForm === FormType.Login ? (
          <LoginForm
            onRegisterClick={() => setCurrentForm(FormType.Register)}
          />
        ) : (
          <RegisterForm onLoginClick={() => setCurrentForm(FormType.Login)} />
        )}
      </div>
    </div>
  );
};
