import { useSelector } from "react-redux";
import { AuthState } from "src/features/auth/types";
import { User } from "src/features/users/types";
import { RootState } from "src/types";

const useAuth = (): AuthState => {
  return useSelector((state: RootState) => state.auth);
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
