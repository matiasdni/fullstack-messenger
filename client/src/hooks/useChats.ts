import { useSelector } from "react-redux";
import { setActiveChat } from "src/features/chats/chatsSlice";
import { Chat, ChatState } from "src/features/chats/types";
import { useAppDispatch } from "src/store";
import { RootState } from "src/types";

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
