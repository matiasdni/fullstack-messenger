import { useAppSelector } from "../../store";
import { selectActiveChat } from "../../features/chats/chatsSlice";
import { Chat as ChatType } from "../../features/chats/types";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import ChatInputForm from "./ChatInputForm";
import { useToken } from "src/hooks/useAuth";

export const Chat = () => {
  const token = useToken();
  const activeChat: ChatType = useAppSelector(selectActiveChat);

  return activeChat ? (
    <div className="flex h-full w-full flex-col ">
      <div className="flex flex-1 flex-col divide-y divide-neutral-200 dark:divide-neutral-700">
        <ChatHeader activeChat={activeChat} />
        <MessageList activeChat={activeChat} />
      </div>

      {/*input*/}
      <ChatInputForm activeChat={activeChat} token={token} />
    </div>
  ) : (
    <div className="flex h-full w-full flex-col divide-y divide-neutral-200 dark:divide-neutral-700  dark:bg-gray-700/5 ">
      <ChatHeader />
      {/*messages*/}
      <MessageList />
    </div>
  );
};
