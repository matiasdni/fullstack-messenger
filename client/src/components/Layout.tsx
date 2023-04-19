import { Outlet } from "react-router-dom";
import React from "react";

const Layout = () => {
  return (
    <>
      <div className="container h-screen">
        <main className="box-border h-full w-full">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
