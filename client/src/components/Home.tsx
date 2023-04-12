import React from "react";

export const Home = () => {
  return (
    <div>
      <header className="border-gray-700">
        <nav className="flex items-center justify-between flex-wrap bg-gray-900 p-6">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <span className="font-semibold text-xl tracking-tight">
              <a href="/">Home</a>
            </span>
          </div>
          <div className="block lg:hidden">
            <button className="flex items-center px-3 py-2 border rounded text-gray-200 border-gray-400 hover:text-white hover:border-white">
              <svg
                className="fill-current h-3 w-3"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>
          <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <div className="text-sm lg:flex-grow">
              <a
                href="/"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-white mr-4"
              >
                Home
              </a>
              <a
                href="/dashboard"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-white mr-4"
              >
                Dashboard
              </a>
              <a
                href="/login"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-white"
              >
                Login
              </a>
            </div>
            <div>
              <a
                href="/register"
                className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-800 hover:bg-white mt-4 lg:mt-0"
              >
                Register
              </a>
            </div>
          </div>
        </nav>
      </header>
      <main className="container">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-center">Home Page</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            fugit, voluptate quas doloribus, magni, sit quia autem quae
            perferendis pariatur accusantium consequuntur? Quasi, quisquam
            distinctio. Quos, cumque! Dolorem, quod doloremque.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            fugit, voluptate quas doloribus, magni, sit quia autem quae
            perferendis pariatur accusantium consequuntur? Quasi, quisquam
            distinctio. Quos, cumque! Dolorem, quod doloremque.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            fugit, voluptate quas doloribus, magni, sit quia autem quae
            perferendis pariatur accusantium consequuntur? Quasi, quisquam
            distinctio. Quos, cumque! Dolorem, quod doloremque.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            fugit, voluptate quas doloribus, magni, sit quia autem quae
            perferendis pariatur accusantium consequuntur? Quasi, quisquam
            distinctio. Quos, cumque! Dolorem, quod doloremque.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            fugit, voluptate quas doloribus, magni, sit quia autem quae
            perferendis pariatur accusantium consequuntur? Quasi, quisquam
            distinctio. Quos, cumque! Dolorem, quod doloremque.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            fugit, voluptate quas doloribus, magni, sit quia autem quae
            perferendis pariatur accusantium consequuntur? Quasi, quisquam
            distinctio. Quos, cumque! Dolorem, quod doloremque.
          </p>
        </div>
      </main>
      <footer className="border-gray-700">
        <div className="container">
          <div className="flex flex-col items-center justify-center">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
              fugit, voluptate quas doloribus, magni, sit quia autem quae
              perferendis pariatur accusantium consequuntur? Quasi, quisquam
              distinctio. Quos, cumque! Dolorem, quod doloremque.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
              fugit, voluptate quas doloribus, magni, sit quia autem quae
              perferendis pariatur accusantium consequuntur? Quasi, quisquam
              distinctio. Quos, cumque! Dolorem, quod doloremque.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
              fugit, voluptate quas doloribus, magni, sit quia autem quae
              perferendis pariatur accusantium consequuntur? Quasi, quisquam
              distinctio. Quos, cumque! Dolorem, quod doloremque.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
