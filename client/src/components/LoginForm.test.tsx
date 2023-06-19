import { renderWithProviders, screen, userEvent } from "@/utils/test-utils";
import { vi } from "vitest";
import { LoginForm } from "./LoginForm";

describe("LoginForm component", () => {
  const navigate = vi.fn();
  const handleSubmit = vi.fn();
  const onRegisterClick = vi.fn();

  beforeEach(() => {
    navigate.mockClear();
    handleSubmit.mockClear();
    onRegisterClick.mockClear();
  });

  test("renders login form", () => {
    renderWithProviders(
      <LoginForm
        navigate={navigate}
        handleSubmit={handleSubmit}
        onRegisterClick={onRegisterClick}
      />
    );

    const loginForm = screen.getByTestId("login-form");
    expect(loginForm).toBeInTheDocument();
  });

  test("renders login form with correct fields", () => {
    renderWithProviders(
      <LoginForm
        navigate={navigate}
        handleSubmit={handleSubmit}
        onRegisterClick={onRegisterClick}
      />
    );

    const usernameField = screen.getByLabelText("Username");
    const passwordField = screen.getByLabelText("Password");
    const loginButton = screen.getByRole("button");

    expect(usernameField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();

    expect(usernameField).toHaveAttribute("type", "text");
    expect(passwordField).toHaveAttribute("type", "password");
    expect(loginButton).toHaveAttribute("type", "submit");
  });

  test("renders login form with correct labels", () => {
    renderWithProviders(
      <LoginForm
        navigate={navigate}
        handleSubmit={handleSubmit}
        onRegisterClick={onRegisterClick}
      />
    );

    const usernameLabel = screen.getByText("Username");
    const passwordLabel = screen.getByText("Password");
    const loginButton = screen.getByRole("button");

    expect(usernameLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();

    expect(usernameLabel).toHaveAttribute("for", "login-username");
    expect(passwordLabel).toHaveAttribute("for", "login-password");
    expect(loginButton).toHaveAttribute("type", "submit");
  });

  // test typing in the fields and submitting the form
  // test clicking on the register button

  test("submits the form", () => {
    renderWithProviders(
      <LoginForm
        navigate={navigate}
        handleSubmit={handleSubmit}
        onRegisterClick={onRegisterClick}
      />
    );

    const usernameField = screen.getByPlaceholderText("Username");
    const passwordField = screen.getByPlaceholderText("Password");
    const button = screen.getByText("Sign In");
    // type in the fields
    userEvent.type(usernameField, "username");
    userEvent.type(passwordField, "password");

    userEvent.type(usernameField, "username").then(() => {
      expect(usernameField).toHaveValue("username");
    });

    userEvent.type(passwordField, "password").then(() => {
      expect(passwordField).toHaveValue("password");
    });

    vi.spyOn(handleSubmit, "getMockImplementation").mockReturnValue = vi.fn();

    userEvent.click(button).then(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
