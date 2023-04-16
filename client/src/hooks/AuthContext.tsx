import { login, logOut } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: any) => state.auth.token);
  const isAuthenticated = !!token;

  const handleLogin = (username: string, password: string) => {
    dispatch(login({ username, password }));
  };
  const handleLogout = () => {
    dispatch(logOut());
  };

  return {
    isAuthenticated,
    token,
    handleLogin,
    handleLogout,
  };
};
