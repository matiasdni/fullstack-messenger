import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { Avatar } from "./common/Avatar";
import { Modal } from "./common/Modal";
import { User } from "../features/users/types";
import { selectActiveChat, setActiveChat } from "../features/chats/chatsSlice";

const ChatItem = ({ chat }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const activeChat = useAppSelector(selectActiveChat);
  const { name, messages } = chat;
  const lastMessage =
    messages?.length > 0 ? messages[messages?.length - 1] : null;
  const time = new Date(lastMessage?.createdAt).toLocaleTimeString("fi-FI", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const userNameInclude = (
    <span>{`${lastMessage?.user.username}: ${lastMessage?.content}`}</span>
  );

  const handleChatItemClick = () => {
    dispatch(setActiveChat(chat));
  };

  const includeUsername = chat.users?.length > 1;

  const isActive = chat.id === activeChat?.id;
  const activeChatClass = isActive ? "bg-gray-200 dark:bg-gray-800" : "";

  const nameToDisplay =
    chat.chat_type === "group"
      ? name
      : chat.users.find((u) => u.id !== user.id).username;

  return (
    <li
      className={`cursor-pointer border-b border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 ${activeChatClass}`}
      onClick={handleChatItemClick}
    >
      <div className="flex items-center p-3">
        <figure className="h-10 w-10 flex-none">
          <Avatar />
        </figure>
        <div className="ml-2 flex w-full flex-col justify-center overflow-hidden">
          <div className="flex w-full grow flex-row flex-nowrap items-center justify-between whitespace-nowrap">
            <p className="font-bold">{nameToDisplay}</p>
            <div className="flex flex-row items-center gap-2"></div>
            <p className="text-xs">{time}</p>
          </div>
          <p className="truncate align-top text-sm">
            {messages?.length > 0 ? (
              includeUsername ? (
                userNameInclude
              ) : (
                lastMessage.content
              )
            ) : (
              <>No messages</>
            )}
          </p>
        </div>
      </div>
    </li>
  );
};

const ChatList = ({ chats }) => {
  const sortedChats = chats
    .map((chat) => ({
      ...chat,
    }))
    .sort((a, b) => {
      // handle case where messages is undefined
      if (!a.messages || !b.messages) return 0;
      const aDate = new Date(a.messages[a.messages.length - 1]?.createdAt);
      const bDate = new Date(b.messages[b.messages.length - 1]?.createdAt);
      return bDate.getTime() - aDate.getTime();
    });

  return (
    <ul className="overflow-y-auto overflow-x-hidden">
      {sortedChats?.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </ul>
  );
};

interface SidebarHeaderProps {
  user: User;
  openModal: () => void;
}

function SidebarHeader({ user, openModal }: SidebarHeaderProps) {
  return (
    <header className="flex cursor-default flex-row items-center gap-2 bg-gray-200 px-3 py-2 dark:bg-gray-800">
      <div className="h-10 w-10">
        <Avatar />
      </div>
      <h1 className="w-auto text-center text-xl">
        Welcome <span>{user?.username}</span>
      </h1>
      {/* plus icon to add room/group */}
      <div className="flex-grow"></div>
      <div className="cursor-pointer" onClick={openModal}>
        <svg
          viewBox="0 0 1024 1024"
          fill="currentColor"
          className="flex h-6 w-6 items-baseline justify-center pt-1 align-text-bottom text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z" />
          <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z" />
        </svg>
      </div>
    </header>
  );
}

export const Sidebar = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const allChats = useAppSelector((state) => state.chats.chats);
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="max-w-[520px] overflow-x-hidden">
      <aside className="flex flex-col border">
        <SidebarHeader user={user} openModal={() => setOpenModal(true)} />
        {/* chats list */}
        <ChatList chats={allChats} />
      </aside>
      {openModal && <Modal handleCloseModal={() => setOpenModal(false)} />}
    </div>
  );
};
