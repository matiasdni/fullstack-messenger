import { socket } from "@/app/socket";
import { AppDispatch } from "@/app/store";
import {
  addChatInvite,
  addFriend,
  addFriendRequest,
  removeFriendRequest,
  updateUser,
} from "features/auth/authSlice";
import {
  addMessage,
  getChatById,
  removeChat,
  updateChat,
} from "features/chats/chatsSlice";
import { Chat, Message } from "features/chats/types";
import { setNotification } from "features/notification/notificationSlice";
import { friendRequest, User } from "features/users/types";
import React from "react";

export const onConnect =
  (chatsRef: React.MutableRefObject<Chat[]>) => (): void => {
    console.log("socket connected");
    chatsRef.current.forEach((chat: Chat) => socket.emit("join-room", chat.id));
  };

export function onDisconnect() {
  return () => console.log("socket disconnected");
}

export function onMessage(
  chatsRef: React.MutableRefObject<Chat[]>,
  dispatch: AppDispatch,
  currentUser: User
) {
  return async (data: Message): Promise<void> => {
    console.log("message received");
    const chat = chatsRef.current.find((chat) => chat.id === data.chatId);
    if (!chat) {
      await dispatch(getChatById(data.chatId));
    } else {
      dispatch(addMessage(data));
    }
    if (data.userId !== currentUser.id)
      dispatch(setNotification({ message: "New Message!", status: "info" }));
  };
}

export function onFriendRequest(dispatch: AppDispatch) {
  return (data: any) => {
    console.log("friend request received", data);
    dispatch(
      setNotification({
        message: `${data.username} sent you a friend request`,
        status: "info",
      })
    );
    dispatch(addFriendRequest(data));
  };
}

export function onFriendRequestAccepted(dispatch: AppDispatch) {
  return (data: { friendRequest: friendRequest; newFriend: User }) => {
    console.log("friend request accepted");
    dispatch(addFriend(data.newFriend));
    dispatch(removeFriendRequest(data.friendRequest));
  };
}

export function onChatInvite(dispatch: AppDispatch) {
  return (data: any) => {
    dispatch(
      setNotification({
        message: "You have been invited to a chat",
        status: "info",
      })
    );
    return dispatch(addChatInvite(data));
  };
}

export function onUserUpdate(dispatch: AppDispatch) {
  return (data) => dispatch(updateUser(data));
}

export function onChatUpdate(dispatch: AppDispatch) {
  return (data) => dispatch(updateChat(data));
}

export function onLeaveRoom(dispatch: AppDispatch) {
  return (data) => dispatch(removeChat(data));
}
