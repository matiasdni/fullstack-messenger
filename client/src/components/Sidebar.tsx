import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { Avatar } from "./Avatar";
import { Modal } from "./Modal";
import { createPortal } from "react-dom";
import { User } from "../features/users/types";
import { selectActiveChat, setActiveChat } from "../features/chats/chatsSlice";

const ChatItem = ({ chat }) => {
  const dispatch = useAppDispatch();
  const activeChat = useAppSelector(selectActiveChat);
  const { name, updatedAt, messages } = chat;
  const date = new Date(updatedAt);
  const time = date.toLocaleTimeString("fi-FI", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const userNameInclude = (
    <span>{`${messages[0]?.user.username}: ${messages[0]?.content}`}</span>
  );

  const handleChatItemClick = () => {
    dispatch(setActiveChat(chat));
  };

  const includeUsername = chat.users?.length > 1;

  const isActive = chat.id === activeChat.id;
  const activeChatClass = isActive ? "bg-gray-200 dark:bg-gray-800" : "";

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
            <p className="font-bold">{name}</p>
            <div className="flex flex-row items-center gap-2"></div>
            <p className="text-xs">{time}</p>
          </div>
          <p className="truncate align-top text-sm">
            {messages[0] ? (
              includeUsername ? (
                userNameInclude
              ) : (
                messages[0].content
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
  return (
    <ul className="overflow-y-auto overflow-x-hidden">
      {chats?.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </ul>
  );
};

function SidebarHeader(props: { user: User; onClick: () => void }) {
  return (
    <header className="flex cursor-default flex-row items-center gap-2 bg-gray-200 px-3 py-2 dark:bg-gray-800">
      <div className="h-10 w-10">
        <Avatar />
      </div>
      <h1 className="w-auto text-center text-xl">
        Welcome <span>{props.user?.username}</span>
      </h1>
      {/* plus icon to add room/group */}
      <div className="flex-grow"></div>
      <div className="cursor-pointer" onClick={props.onClick}>
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

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCreateChat = (e) => {
    e.preventDefault();
  };

  return (
    <aside className="flex flex-col border">
      {openModal &&
        createPortal(
          <Modal
            openModal={handleOpenModal}
            handleCloseModal={handleCloseModal}
            handleCreateChat={handleCreateChat}
            cancelBtnRef={null}
          />,
          document.body
        )}
      <SidebarHeader user={user} onClick={handleOpenModal} />
      {/* chats list */}
      <ChatList chats={allChats} />
    </aside>
  );
};
