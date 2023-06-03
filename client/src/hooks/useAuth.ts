import { useSelector } from "react-redux";
import { AuthState } from "../features/auth/types";
import { User } from "../features/users/types";
import { RootState } from "../types";

const useAuth = (): AuthState => {
  return useSelector((state: RootState): AuthState => state.auth);
};

const useToken = (): string => {
  const { token } = useAuth();
  return token;
};

const useUser = (): User => {
  const { user } = useAuth();
  return user as User;
};

export { useAuth, useToken, useUser };
