import { Chat } from "./features/chats/types";
import { Invite } from "./features/users/types";
export const users = [
  {
    id: "1",
    username: "John Doe",
    role: "user",
  },
  {
    id: "2",
    username: "Jane Doe",
    role: "user",
  },
  {
    id: "3",
    username: "Bob Smith",
    role: "user",
  },
];

export const chats: Chat[] = [
  {
    id: "1",
    name: "Chat 1",
    users: [users[0], users[1]],
    updatedAt: Date(),
    chat_type: "group",
  },
  {
    id: "2",
    name: "Chat 2",
    users: [users[0], users[2]],
    updatedAt: Date(),
    chat_type: "group",
  },
];

export const invites: Invite[] = [
  {
    id: "1",
    receiver: {
      id: "2",
      username: "Jane Doe",
      role: "user",
    },
    status: "pending",
    sender: {
      id: "1",
      username: "John Doe",
      role: "user",
    },
    chat: chats[0],
    createdAt: new Date("2021-07-09T12:59:59.000Z"),
    message: "Invited you to a chat:",
  },
  {
    id: "2",
    sender: {
      id: "1",
      username: "John Doe",
      role: "user",
    },
    receiver: {
      id: "3",
      username: "Bob Smith",
      role: "user",
    },
    status: "pending",
    chat: chats[1],
    createdAt: new Date("2020-06-11T09:31:00"),
    message: "Invited you to a chat:",
  },
  {
    id: "3",
    sender: {
      id: "2",
      username: "Jane Doe",
      role: "user",
    },
    receiver: {
      id: "3",
      username: "Bob Smith",
      role: "user",
    },
    status: "pending",
    chat: chats[1],
    createdAt: new Date("2020-06-11T09:32:00"),
    message: "Invited you to a chat:",
  },
];
