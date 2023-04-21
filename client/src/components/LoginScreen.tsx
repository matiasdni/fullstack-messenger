import React, { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

enum FormType {
  Login,
  Register,
}

export const LoginScreen: React.FC = () => {
  const [currentForm, setCurrentForm] = useState(FormType.Login);

  return (
    <>
      {currentForm === FormType.Login ? (
        <LoginForm onRegisterClick={() => setCurrentForm(FormType.Register)} />
      ) : (
        <RegisterForm onLoginClick={() => setCurrentForm(FormType.Login)} />
      )}
    </>
  );
};
