import { Avatar } from "./Avatar";
import { Chat as ChatType } from "../features/chats/types";
import React from "react";

interface ChatHeaderProps {
  activeChat: ChatType | null;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ activeChat }) => {
  return (
    <header className="bg-grey-lighter border px-3 py-2">
      <div className="flex items-center">
        <figure className="h-10 w-10">
          <Avatar />
        </figure>
        <div className="ml-4">
          <p>{activeChat?.name}</p>
          <p className="text-xs">
            {activeChat?.users.map((user) => user.username).join(", ")}
          </p>
        </div>
      </div>
    </header>
  );
};
