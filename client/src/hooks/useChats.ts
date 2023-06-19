import { useAppDispatch } from "@/app/store";
import { RootState } from "app/store";
import { setActiveChat } from "features/chats/chatsSlice";
import { Chat, ChatState } from "features/chats/types";
import { useSelector } from "react-redux";

import { PayloadAction } from "@reduxjs/toolkit";

export const useChats = (): [
  ChatState,
  (id: string) => PayloadAction<string, "chats/setActiveChat">
] => {
  const dispatch = useAppDispatch();
  const chats = useSelector((state: RootState) => state.chats);

  const dispatchSetActiveChat = (
    id: string
  ): PayloadAction<string, "chats/setActiveChat"> => {
    return dispatch(setActiveChat(id));
  };

  return [chats, dispatchSetActiveChat];
};

export const useActiveChat = (): Chat => {
  const [chatState] = useChats();
  const { chats, activeChatId } = chatState;
  return chats.find((chat) => chat.id === activeChatId);
};
