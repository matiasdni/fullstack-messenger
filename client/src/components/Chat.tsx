import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useAppSelector } from "../store";
import { selectActiveChat } from "../features/chats/chatsSlice";
import { Chat as ChatType } from "../features/chats/types";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInputForm } from "./ChatInputForm";

export const Chat = () => {
  const activeChat: ChatType = useAppSelector(selectActiveChat);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    setMessages(activeChat?.messages);

    socket.on(`message-${activeChat?.id}`, (data) => {
      console.log("message received");
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.off("message");
    };
  }, [activeChat]);

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
      <MessageList messages={messages} activeChatId={activeChat.id} />

      {/*input*/}
      <ChatInputForm onSubmit={sendMessage} />
    </section>
  ) : null;
};
