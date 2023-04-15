import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router";
import { useAuth } from "../hooks/AuthContext";

const PrivateRoute = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default PrivateRoute;
