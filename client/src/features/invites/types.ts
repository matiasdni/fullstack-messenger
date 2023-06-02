import { Status } from "../../../../shared/types";
import { User } from "../users/types";

export interface Invite {
  id: string;
  sender: User;
  chat: {
    id: string;
    name: string;
  };
  status?: Status;
  createdAt: Date;
  updatedAt?: Date;
  type?: string;
}
