import { GetPendingInvitesOutput } from "../../../../shared/types";

export interface friendRequest {
  id: string;
  userId: string;
  username: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  friends?: User[];
  chatInvites?: GetPendingInvitesOutput;
  friendRequests?: friendRequest[];
}

export type UsersInitialState = User[];
