import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router";
import { useAppSelector } from "store";

const PrivateRoute = () => {
  const location = useLocation();
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = !!token;

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default PrivateRoute;
