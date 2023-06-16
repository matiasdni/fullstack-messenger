import { AuthState } from "features/auth/types";
import { ChatState } from "features/chats/types";
import { Invite } from "features/invites/types";
import { User } from "features/users/types";

export type RootState = {
  chats: ChatState;
  users: User[];
  auth: AuthState;
  invites: Invite[];
  notifications: {
    message: string | null;
    status: "success" | "error" | "warning" | "info";
  };
};
