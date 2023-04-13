import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { login, logout } from "../features/auth/authSlice";
import { isTokenValid } from "../services/auth";

export const useAuth = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = isTokenValid(token);

  const handleLogin = (token: string) => {
    dispatch(login(token));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    isAuthenticated,
    token,
    handleLogin,
    handleLogout,
  };
};
