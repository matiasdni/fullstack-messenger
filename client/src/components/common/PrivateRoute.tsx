import { useAppSelector } from "@/app/store";
import { useLocation } from "react-router";
import { Navigate, Outlet } from "react-router-dom";

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
