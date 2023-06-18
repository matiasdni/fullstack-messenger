import { Outlet } from "react-router-dom";
import React from "react";
import Notification from "components/common/Notification";

const Layout = () => {
  return (
    <>
      <div className="dark:bg-gray-900 relative">
        <>
          <Notification />
          <Outlet />
        </>
        <div id="modal" />
      </div>
    </>
  );
};

export default Layout;
