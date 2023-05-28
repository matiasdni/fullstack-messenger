import { useSelector } from "react-redux";
import { Chat, ChatState } from "src/features/chats/types";
import { RootState } from "src/types";

export const useChats = (): ChatState => {
  const chats = useSelector((state: RootState) => state.chats);
  return chats;
};

export const useActiveChat = (): Chat | undefined => {
  const { activeChatId, chats } = useChats();
  return chats.find((chat) => chat.id === activeChatId);
};
