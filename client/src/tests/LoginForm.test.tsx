import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { LoginForm } from "../components/LoginForm.js";
import { fireEvent, render, screen } from "@testing-library/react";

describe("LoginForm", () => {
  it("renders the login form correctly", () => {
    const handleRegisterClick = jest.fn();
    const handleLogin = jest.fn();

    render(
      <LoginForm onRegisterClick={handleRegisterClick} onLogin={handleLogin} />
    );

    const usernameInput = screen.getByLabelText("Username:");
    const passwordInput = screen.getByLabelText("Password:");
    const loginButton = screen.getByRole("button", { name: "Login" });
    const registerButton = screen.getByText("Register");

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
  });

  it("handles input changes", () => {
    const handleRegisterClick = jest.fn();
    const handleLogin = jest.fn();

    render(
      <LoginForm onRegisterClick={handleRegisterClick} onLogin={handleLogin} />
    );

    const usernameInput = screen.getByLabelText(
      "Username:"
    ) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      "Password:"
    ) as HTMLInputElement;

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });

    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("testpassword");
  });

  it("calls onLogin when the form is submitted", () => {
    const handleRegisterClick = jest.fn();
    const handleLogin = jest.fn();

    render(
      <LoginForm onRegisterClick={handleRegisterClick} onLogin={handleLogin} />
    );

    const form = screen.getByTestId("login-form");

    fireEvent.submit(form);

    expect(handleLogin).toHaveBeenCalledTimes(1);
  });

  it("calls onRegisterClick when the Register button is clicked", () => {
    const handleRegisterClick = jest.fn();
    const handleLogin = jest.fn();

    render(
      <LoginForm onRegisterClick={handleRegisterClick} onLogin={handleLogin} />
    );

    const registerButton = screen.getByText("Register");

    fireEvent.click(registerButton);

    expect(handleRegisterClick).toHaveBeenCalledTimes(1);
  });
});
