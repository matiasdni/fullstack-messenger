import { ChatHeaderProps } from "@/components/chat/ChatHeader";
import React, { useEffect, useRef } from "react";
import { Message } from "./Message";

export const MessageList: React.FC<ChatHeaderProps> = ({ activeChat }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  return (
    <div className="flex-1 h-full px-3 py-2 overflow-y-auto shadow-sm">
      {activeChat?.messages?.map((message, index) => (
        <Message key={index} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
