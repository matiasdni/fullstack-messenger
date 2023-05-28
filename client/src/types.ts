import { ChatState } from "./features/chats/types";
import { User } from "./features/users/types";
import { AuthState } from "./features/auth/types";
import { Invite } from "./features/invites/types";

export type RootState = {
  chats: ChatState;
  users: User[];
  auth: AuthState;
  invites: Invite[];
};
