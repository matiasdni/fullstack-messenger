import { Status } from "../../../../shared/types";
export interface Invite {
  id: string;
  sender: User;
  chat: {
    id: string;
    name: string;
  };
  status?: Status;
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
}

export type UsersInitialState = User[];
