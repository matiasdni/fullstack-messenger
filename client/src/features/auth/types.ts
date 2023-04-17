import { User } from "../users/types";

export type AuthState = {
  user: User;
  token: string | null;
};

export type AuthInitialState = {
  user: User | null;
  token: string | null;
};

export type LoginData = {
  username: string;
  password: string;
};

export type LoginPayload = AuthState;
