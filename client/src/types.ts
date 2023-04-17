import { ChatState } from "./features/chats/types";
import { User } from "./features/users/types";
import { AuthState } from "./features/auth/types";

export type RootState = {
  chats: ChatState;
  users: User[];
  auth: AuthState;
};
