export interface AuthState {
  user: User;
  token: string | null;
}

export type LoginData = {
  username: string;
  password: string;
};

export type User = {
  id: string;
  username: string;
  role: string;
};
