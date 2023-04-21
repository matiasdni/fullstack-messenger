import { Message } from "./Message";
import React, { useEffect, useRef } from "react";
import { useAppSelector } from "../store";
import { selectActiveChat } from "../features/chats/chatsSlice";

export const MessageList: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const activeChat = useAppSelector(selectActiveChat);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat.messages]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2">
      {activeChat.messages?.map((message, index) => (
        <Message key={index} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
