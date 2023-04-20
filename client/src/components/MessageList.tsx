import { Message } from "./Message";
import { Message as MessageType } from "../features/chats/types";
import React, { useEffect, useRef, useState } from "react";
import { usePrevious } from "../hooks/usePrevious";

interface MessageListProps {
  messages: MessageType[] | null;
  activeChatId: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  activeChatId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const prevActiveChatId = usePrevious(activeChatId);
  const [switchedChat, setSwitchedChat] = useState(false);

  useEffect(() => {
    if (prevActiveChatId !== activeChatId) {
      setSwitchedChat(true);
    } else {
      setSwitchedChat(false);
    }
  }, [activeChatId, prevActiveChatId]);

  useEffect(() => {
    if (messagesEndRef.current && (switchedChat || prevActiveChatId === null)) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [prevActiveChatId, switchedChat]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2">
      {messages?.map((message, index) => (
        <Message key={index} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
