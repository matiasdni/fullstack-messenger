import { Avatar } from "../common/Avatar";
import { Chat as ChatType } from "../../features/chats/types";
import { FC } from "react";

export interface ChatHeaderProps {
  activeChat?: ChatType | null;
}

export const ChatHeader: FC<ChatHeaderProps> = ({ activeChat }) => {
  return (
    <header className="bg-neutral-50/50 dark:bg-gray-800">
      <div className="flex items-center p-4">
        <figure className="h-10 w-10">
          <Avatar />
        </figure>
        <div className="ml-4">
          <p>{activeChat?.name}</p>
          <p className="text-xs">
            {activeChat?.users?.map((user) => user.username).join(", ")}
          </p>
        </div>
      </div>
    </header>
  );
};
