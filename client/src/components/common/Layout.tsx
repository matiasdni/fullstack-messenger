import { Outlet } from "react-router-dom";
import React from "react";

const Layout = () => {
  return (
    <>
      <div className="dark:bg-gray-900">
        <main className="container box-border dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
