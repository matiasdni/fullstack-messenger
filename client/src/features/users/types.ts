import { Invite } from "../../../../shared/types";

export interface User {
  id: string;
  username: string;
  friends?: User[];
  chatInvites?: Invite[];
  friendRequests?: User[];
}

export type UsersInitialState = User[];
