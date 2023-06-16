import ChatHeader from "@/components/chat/ChatHeader";
import { useToken } from "hooks/useAuth";
import { selectActiveChat } from "../../features/chats/chatsSlice";
import { Chat as ChatType } from "../../features/chats/types";
import { useAppSelector } from "../../store";
import ChatInputForm from "./ChatInputForm";
import { MessageList } from "./MessageList";

export const Chat = () => {
  const token = useToken();
  const activeChat: ChatType = useAppSelector(selectActiveChat);

  return activeChat ? (
    <div className="absolute inset-0 flex flex-col">
      <ChatHeader activeChat={activeChat} />
      <MessageList activeChat={activeChat} />
      {/*input*/}
      <ChatInputForm activeChat={activeChat} token={token} />
    </div>
  ) : (
    <div className="flex flex-col h-full divide-y basis-full divide-neutral-200 dark:divide-neutral-700 dark:bg-gray-700/5 ">
      <ChatHeader />
      {/*messages*/}
      <MessageList />
    </div>
  );
};
