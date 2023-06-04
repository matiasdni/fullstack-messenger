import "@testing-library/jest-dom/extend-expect";

// describe("RegisterForm", () => {
//   it("renders the register form correctly", () => {
//     const handleLoginClick = jest.fn();
//     render(<RegisterForm onLoginClick={handleLoginClick} />);

//     const usernameInput = screen.getByLabelText("Username:");
//     const passwordInput = screen.getByLabelText("Password:");
//     const registerButton = screen.getByRole("button", { name: "Register" });
//     const loginButton = screen.getByText("Login");

//     expect(usernameInput).toBeInTheDocument();
//     expect(passwordInput).toBeInTheDocument();
//     expect(registerButton).toBeInTheDocument();
//     expect(loginButton).toBeInTheDocument();
//   });

//   it("handles input changes", () => {
//     const handleLoginClick = jest.fn();
//     render(<RegisterForm onLoginClick={handleLoginClick} />);

//     const usernameInput = screen.getByLabelText(
//       "Username:"
//     ) as HTMLInputElement;
//     const passwordInput = screen.getByLabelText(
//       "Password:"
//     ) as HTMLInputElement;

//     fireEvent.change(usernameInput, { target: { value: "testuser" } });
//     fireEvent.change(passwordInput, { target: { value: "testpassword" } });

//     expect(usernameInput.value).toBe("testuser");
//     expect(passwordInput.value).toBe("testpassword");
//   });

//   it("calls onLoginClick when the Login button is clicked", () => {
//     const handleLoginClick = jest.fn();
//     render(<RegisterForm onLoginClick={handleLoginClick} />);

//     const loginButton = screen.getByText("Login");

//     fireEvent.click(loginButton);

//     expect(handleLoginClick).toHaveBeenCalledTimes(1);
//   });
// });
