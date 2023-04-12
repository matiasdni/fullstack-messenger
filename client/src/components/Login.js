import React from "react";
// import { useAuth } from "../contexts/AuthContext";

// const emailRef = useRef();
// const passwordRef = useRef();
// const { login } = useAuth();
// const [error, setError] = useState("");
// const [loading, setLoading] = useState(false);
//
// const history = useHistory();

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     setError("");
//     setLoading(true);
//     await login(emailRef.current.value, passwordRef.current.value);
//     history.push("/");
//   } catch {
//     setError("Failed to log in");
//   }
//
//   setLoading(false);
// };

function Login() {
  return (
    <div className="h-screen w-screen border-none bg-cover dark:bg-gray-900">
      <div className=" max-w-sm mx-auto h-auto">
        <form
          // onSubmit={handleSubmit}
          className="bg-blue-50 form-input my-auto border-0 ring-2 ring-neutral-200 shadow-md dark:ring-0  dark:border-collapse dark:bg-gray-800 dark:shadow-2xl dark:border-gray-700 dark:text-gray-300"
        >
          <div className="flex-col grow p-4 text-sm rounded-md shrink md:shrink-0">
            <h5 className="font-bold text-2xl text-gray-900 dark:text-white p-1.0 ml-1.5 mt-5 mb-6 prose-2xl ">
              Sign in to your account
            </h5>
            {/*min-h-[700px] min-w-full shadow-xl p-6*/}
            <div className="p-2">
              <label
                className="block py-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="email"
              >
                Email
              </label>
              <input
                // ref={emailRef}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                id="email"
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="p-2">
              <label
                className="block py-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="password"
              >
                Password
              </label>
              <input
                // ref={passwordRef}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white transition-none"
                id="password"
                type="password"
                placeholder="******************"
                required
              />
            </div>

            <div className="p-2 w-full h-full">
              <div className="  mb-2 h-full w-full">
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
                    to="/forgot-password"
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
              <div className="text-sm mt-20 mb-3 font-sans hei text-gray-500 dark:text-gray-300">
                Not registered?{" "}
                <a
                  href="#"
                  className="text-blue-700 hover:underline dark:text-blue-500"
                >
                  Create account
                </a>
              </div>
            </div>
          </div>
        </form>
        <p className="text-center mt-2 text-gray-500 text-xs">
          &copy;2023 matiasdn. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;
