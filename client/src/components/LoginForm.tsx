import { FC, useState } from "react";
import { Link } from "react-router-dom";

type LoginFormProps = {
  onRegisterClick: () => void;
  navigate: (path: string) => void;
  handleSubmit: (username: string, password: string) => void;
};

export const LoginForm: FC<LoginFormProps> = ({
  onRegisterClick,
  navigate,
  handleSubmit,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(username, password);
        }}
        data-testid="login-form"
        className="form-input m-auto max-w-md rounded-lg border-0 bg-blue-50 py-[16px] shadow-md ring-1 dark:border-collapse  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:shadow-2xl dark:ring-0"
      >
        <div className="flex flex-col gap-4 p-4 md:p-8">
          <header>
            <h3 className="text-2xl font-bold">Sign in to your account</h3>
          </header>
          {/* input fields */}
          <div>
            <label
              htmlFor="login-username"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>
            <input
              id="login-username"
              data-testid="login-username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              data-testid="login-password"
              placeholder="Password"
              autoComplete={"current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 transition-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <div>
            <button
              // disabled={loading}
              className="h-10 w-full rounded-lg bg-blue-700 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="submit"
              data-testid="login-button"
            >
              Sign In
            </button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-300">
            <p className="space-x-1">
              <span>Not registered?</span>
              <Link
                type="button"
                to="/register"
                onClick={onRegisterClick}
                className="text-blue-700 hover:underline dark:text-blue-500"
              >
                <span>Create account</span>
              </Link>
            </p>
          </div>
        </div>
      </form>
      <p className="mt-2 text-center text-xs text-gray-500">
        &copy;2023 matiasdn
      </p>
    </div>
  );
};
