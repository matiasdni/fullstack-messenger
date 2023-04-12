import React, { useState } from "react";

interface Props {
  onRegisterClick: () => void;
  onLogin: () => void;
}

export const LoginForm: React.FC<Props> = ({ onRegisterClick, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement the actual login logic here
    // if successful, call onLogin
    onLogin();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="mb-4 text-2xl font-bold">Login</h2>
      <div>
        <label
          htmlFor="login-username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          id="login-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 font-semibold text-white"
        >
          Login
        </button>
        <button
          type="button"
          onClick={onRegisterClick}
          className="px-4 py-2 font-semibold text-indigo-600"
        >
          Register
        </button>
      </div>
    </form>
  );
};
