export type User = {
  id: string;
  username: string;
  role: string | null;
};

export type UsersInitialState = User[];
