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
    <div className="container grow max-w-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-blue-50 py-[16px] form-input border-0 ring-2 ring-neutral-200 shadow-md dark:ring-0  dark:border-collapse dark:bg-gray-800 dark:shadow-2xl dark:border-gray-700 dark:text-gray-300"
      >
        <h5 className="mb-4 text-2xl font-bold">Register an Account</h5>
        <div className="p-2">
          <label
            htmlFor="login-username"
            className="block py-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Username
          </label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          />
        </div>
        <div className="p-2">
          <label
            htmlFor="login-password"
            className="block py-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white transition-none"
          />
        </div>
        <div className="p-2 mb-2 h-full w-full">
          <div className="inline-flex justify-between w-full">
            <div className="text-sm mb-2">
              <input
                id="remember"
                type="checkbox"
                value=""
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 dark:active:bg-gray-700"
                required
              />

              <label
                htmlFor="remember"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>
            {/*<Link*/}
            <div
              className="justify-end text-sm text-blue-700 hover:underline dark:text-blue-500"
              // to="/forgot-password"
            >
              Lost Password?
            </div>
            {/*</Link>*/}
          </div>
        </div>
        <div className="my-6">
          <button
            // disabled={loading}
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="submit"
          >
            Sign In
          </button>
        </div>
        <div className="text-sm mt-20 font-sans hei text-gray-500 dark:text-gray-300">
          Not registered?{" "}
          <a
            type="button"
            href={"#"}
            onClick={onLoginClick}
            className="text-blue-700 hover:underline dark:text-blue-500"
          >
            Create account
          </a>
        </div>
      </form>
      <p className="text-center mt-2 text-gray-500 text-xs">
        &copy;2023 matiasdn. All rights reserved.
      </p>
    </div>
  );
};

// export const RegisterForm: React.FC<Props> = ({ onLoginClick }) => {
//   const [username, setUsername] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Implement the actual registration logic here
//   };
//
//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <h2 className="mb-4 text-2xl font-bold">Register</h2>
//       <div>
//         <label
//           htmlFor="reg-username"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Username
//         </label>
//         <input
//           id="reg-username"
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
//         />
//       </div>
//       <div>
//         <label
//           htmlFor="reg-password"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Password
//         </label>
//         <input
//           id="reg-password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
//         />
//       </div>
//       <div className="flex items-center justify-between">
//         <button
//           type="submit"
//           className="rounded bg-indigo-600 px-4 py-2 font-semibold text-white"
//         >
//           Register
//         </button>
//         <button
//           type="button"
//           onClick={onLoginClick}
//           className="px-4 py-2 font-semibold text-indigo-600"
//         >
//           Login
//         </button>
//       </div>
//     </form>
//   );
// };
