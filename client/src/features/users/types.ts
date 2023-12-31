import { GetPendingInvitesOutput } from "../../../../shared/types";

export interface friendRequest {
  id?: string;
  friendId: string;
  userId: string;
  username: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  type?: string;
}

export interface User {
  image?: string;
  id: string;
  username: string;
  friends?: User[];
  chatInvites?: GetPendingInvitesOutput;
  friendRequests?: friendRequest[];
  sentFriendRequests?: friendRequest[];
  bio?: string;
  github?: string;
}

export type UsersInitialState = {
  users: User[];
  selectedUser: User | null;
};
