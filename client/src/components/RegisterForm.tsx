import React, { useState } from "react";

interface Props {
  onLoginClick: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onLoginClick }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement the actual registration logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="mb-4 text-2xl font-bold">Register</h2>
      <div>
        <label
          htmlFor="reg-username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          id="reg-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label
          htmlFor="reg-password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="reg-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 font-semibold text-white"
        >
          Register
        </button>
        <button
          type="button"
          onClick={onLoginClick}
          className="px-4 py-2 font-semibold text-indigo-600"
        >
          Login
        </button>
      </div>
    </form>
  );
};
