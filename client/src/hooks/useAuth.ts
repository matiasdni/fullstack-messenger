import { useSelector } from "react-redux";
import { AuthState } from "src/features/auth/types";
import { User } from "src/features/users/types";
import { RootState } from "src/types";

export const useAuth = (): AuthState => {
  const auth = useSelector((state: RootState) => state.auth);
  return auth;
};

export const useToken = (): string => {
  const { token } = useAuth();
  return token;
};

export const useUser = (): User => {
  const { user } = useAuth();
  return user;
};
