import { Message } from "./Message";
import React, { useEffect, useRef, useState } from "react";
import { usePrevious } from "../hooks/usePrevious";
import { useAppSelector } from "../store";
import { selectActiveChat } from "../features/chats/chatsSlice";

export const MessageList: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const activeChat = useAppSelector(selectActiveChat);
  const prevActiveChatId = usePrevious(activeChat.id);
  const [switchedChat, setSwitchedChat] = useState(false);

  useEffect(() => {
    if (prevActiveChatId !== activeChat.id) {
      setSwitchedChat(true);
    } else {
      setSwitchedChat(false);
    }
  }, [activeChat.id, prevActiveChatId]);

  useEffect(() => {
    if (messagesEndRef.current && (switchedChat || prevActiveChatId === null)) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [prevActiveChatId, switchedChat, activeChat?.messages.length]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2">
      {activeChat.messages?.map((message, index) => (
        <Message key={index} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
