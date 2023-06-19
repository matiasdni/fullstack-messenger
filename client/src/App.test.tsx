import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { default as store } from "./app/store";

describe("App component", () => {
  describe("when not logged in", () => {
    beforeEach(() => {
      store.dispatch({ type: "user/logout" });
    });

    test("redirects to /login", () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/"]}>
            <App />
          </MemoryRouter>
        </Provider>
      );

      const signIn = screen.getByText(/Sign in to your account/i);
      const usernameLabel = screen.getByLabelText(/Username/i);
      const passwordLabel = screen.getByLabelText(/Password/i);
      const signInButton = screen.getByRole("button", { name: /Sign in/i });

      expect(signIn).toBeInTheDocument();
      expect(signInButton).toBeInTheDocument();
      expect(usernameLabel).toBeInTheDocument();
      expect(passwordLabel).toBeInTheDocument();
    });
  });

  describe("when navigating to an unknown route", () => {
    test("renders 404 component", () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/unknown"]}>
            <App />
          </MemoryRouter>
        </Provider>
      );

      const notFoundElement = screen.getByText(/404/i);
      expect(notFoundElement).toBeInTheDocument();
    });
  });
});
