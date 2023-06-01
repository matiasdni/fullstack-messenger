import { socket } from "../../socket";
import { useAppSelector } from "../../store";
import { selectActiveChat } from "../../features/chats/chatsSlice";
import { Chat as ChatType } from "../../features/chats/types";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "../MessageList";
import { ChatInputForm } from "./ChatInputForm";

export const Chat = () => {
  const activeChat: ChatType = useAppSelector(selectActiveChat);

  const sendMessage = (input: string) => {
    console.log("sending message");
    if (input.trim().length > 0) {
      try {
        socket.timeout(2000).emit("message", {
          content: input,
          room: activeChat?.id,
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  return activeChat ? (
    <div className="flex h-full w-full flex-col ">
      <div className="flex flex-1 flex-col divide-y divide-neutral-200 dark:divide-neutral-700">
        <ChatHeader activeChat={activeChat} />
        <MessageList activeChat={activeChat} />
      </div>

      {/*input*/}
      <ChatInputForm onSubmit={sendMessage} />
    </div>
  ) : (
    <div className="flex h-full w-full flex-col divide-y divide-neutral-200 dark:divide-neutral-700  dark:bg-gray-700/5 ">
      <ChatHeader />
      {/*messages*/}
      <MessageList />
    </div>
  );
};
