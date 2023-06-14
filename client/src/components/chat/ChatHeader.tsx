import { FC, useState } from "react";
import { Chat } from "../../features/chats/types";
import { Avatar } from "../common/Avatar";
import ChatInfo from "./ChatInfo";

export interface ChatHeaderProps {
  activeChat?: Chat;
}

const ChatHeader: FC<ChatHeaderProps> = ({ activeChat }) => {
  const [showChatInfo, setShowChatInfo] = useState(false);
  const handleChatHeaderClick = () => {
    setShowChatInfo((prev) => !prev);
  };

  if (!activeChat) {
    return (
      <header
        className="bg-neutral-50/50 dark:bg-gray-800"
        onClick={handleChatHeaderClick}
      >
        <div className="flex items-center p-4">
          <figure className="w-10 h-10">
            <Avatar />
          </figure>
          <div className="ml-4">
            <h1 className=" chat">Chat</h1>
            <p className="text-xs">No chat selected</p>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {showChatInfo && (
        <ChatInfo activeChat={activeChat} setShowChatInfo={setShowChatInfo} />
      )}

      <header
        className="cursor-pointer select-none bg-neutral-50/50 dark:bg-gray-800 w-full"
        onClick={handleChatHeaderClick}
      >
        <div className="flex items-center p-4 h-full">
          <figure className="w-10 h-10 chat-image aspect-1">
            <Avatar />
          </figure>
          <div className="ml-4">
            <h3 className="prose whitespace-nowrap truncate">
              {activeChat?.name}
            </h3>
            <p className="text-xs truncate">
              {activeChat?.users?.map((user) => user.username).join(", ")}
            </p>
          </div>
        </div>
      </header>
    </>
  );
};

export default ChatHeader;
