export interface UserState {
  id: number;
  username: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}
