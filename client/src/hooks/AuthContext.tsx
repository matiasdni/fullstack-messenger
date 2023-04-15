import { useAppDispatch, useAppSelector } from "../store";
import { login, logOut } from "../features/auth/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => !!state.auth.token);
  const token = useAppSelector((state) => state.auth.token);

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
