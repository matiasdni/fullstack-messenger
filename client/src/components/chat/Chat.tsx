import { useToken } from "hooks/useAuth";
import { selectActiveChat } from "../../features/chats/chatsSlice";
import { Chat as ChatType } from "../../features/chats/types";
import { useAppSelector } from "../../store";
import { ChatHeader } from "./ChatHeader";
import ChatInputForm from "./ChatInputForm";
import { MessageList } from "./MessageList";

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
