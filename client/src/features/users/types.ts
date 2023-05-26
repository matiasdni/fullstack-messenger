export type Status = "pending" | "accepted" | "rejected";

export interface Invite {
  id: string;
  sender: User;
  receiver?: User | string;
  chat_id?: string;
  status: Status;
}

export interface User {
  friends?: User[];
  invites?: Invite[];
  id: string;
  username: string;
  role: string | null;
}

export type UsersInitialState = User[];
