export interface UserAttributes {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Sender = Pick<UserAttributes, "id" | "username">;
export type TChat = Pick<Chat, "id" | "name">;
export type Senders = Record<string, Sender>;
export type Chats = Record<string, TChat>;
export type Status = "pending" | "accepted" | "rejected";

export interface InviteAttributes {
  id: string;
  status: Status;
  chatId: string;
  recipientId: string;
  senderId: string;
  createdAt: Date;
  updatedAt: Date;
  sender?: Sender;
  chat?: TChat;
}

export interface CreateInviteInput {
  senderId: string;
  chatId: string;
  recipientId: string;
}

export interface AcceptInviteInput {
  inviteId: string;
  userId: string;
}

export interface RejectInviteInput {
  inviteId: string;
  userId: string;
}

export interface GetPendingInvitesInput {
  userId: string;
}

export interface GetPendingInvitesOutput {
  invites: InviteAttributes[];
  senders: Senders;
  chats: Chats;
}
