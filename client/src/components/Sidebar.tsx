import React, { useEffect, useState } from "react";
import { useAppSelector } from "../store";
import { Avatar } from "./Avatar";
import { Modal } from "./Modal";

const ChatItem = ({ chat }) => {
  const { name, updatedAt, Messages } = chat;

  const date = new Date(updatedAt);
  const time = date.toLocaleTimeString("fi-FI", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const userNameInclude = (
    <span>{`${Messages[0].User.username}: ${Messages[0].content}`}</span>
  );

  const includeUsername = chat.Users.length > 1;
  return (
    <li className="cursor-pointer border-b border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
      <div className="flex items-center p-3">
        <figure className="min-w-10 h-10 w-10 flex-none">
          <Avatar />
        </figure>
        <div className="ml-2 flex w-full flex-col justify-center overflow-hidden">
          <div className="flex w-full grow flex-row flex-nowrap items-center justify-between whitespace-nowrap">
            <p className="font-bold">{name}</p>
            <div className="flex flex-row items-center gap-2"></div>
            <p className="text-xs">{time}</p>
          </div>
          <p className="truncate align-top text-sm">
            {includeUsername ? userNameInclude : Messages[0].content}
          </p>
        </div>
      </div>
    </li>
  );
};

const ChatList = ({ chats }) => {
  useEffect(() => {
    console.log(chats);
  }, [chats]);

  return (
    <ul className="overflow-y-auto overflow-x-hidden">
      {chats?.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </ul>
  );
};

export const Sidebar = ({ chats }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { user } = useAppSelector((state) => state.auth);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCreateChat = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const users = e.target.users.value;
  };

  return (
    <div className="h-full">
      <aside className="flex h-full flex-1 flex-col border">
        {/* modal */}
        {openModal && (
          <Modal
            openModal={handleOpenModal}
            handleCloseModal={handleCloseModal}
            handleCreateChat={handleCreateChat}
            cancelBtnRef={null}
          />
        )}
        <header className="flex cursor-default flex-row items-center gap-2 bg-gray-200 px-3 py-2 dark:bg-gray-800 ">
          <div className="h-10 w-10">
            <Avatar />
          </div>
          <h1 className="w-auto text-center text-xl">
            Welcome <span>{user?.username}</span>
          </h1>
          {/* plus icon to add room/group */}
          <div className="flex-grow"></div>
          <div className="cursor-pointer" onClick={handleOpenModal}>
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

        {/* chats list */}

        <ChatList chats={chats} />

        <div className="flex-1"></div>
      </aside>
    </div>
  );
};
