import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useAppSelector } from "../store";
import { selectActiveChat } from "../features/chats/chatsSlice";
import { Chat as ChatType, Message } from "../features/chats/types";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInputForm } from "./ChatInputForm";

export const Chat = () => {
  const activeChat: ChatType = useAppSelector(selectActiveChat);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages(activeChat?.messages);

    return () => {
      socket.off("message");
    };
  }, [activeChat.messages]);

  const sendMessage = (input) => {
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

  return activeChat?.name ? (
    <section className="absolute inset-0 flex h-full flex-col overflow-hidden border">
      <ChatHeader activeChat={activeChat} />

      {/*messages*/}
      <MessageList />

      {/*input*/}
      <ChatInputForm onSubmit={sendMessage} />
    </section>
  ) : null;
};
