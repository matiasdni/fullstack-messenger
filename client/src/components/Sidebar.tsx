import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { Avatar } from "./Avatar";
import { Modal } from "./Modal";
import { getChats, selectChats } from "../features/chats/chatsSlice";

const ChatItem = ({ chat }) => {
  const { name, updatedAt, Messages } = chat;

  const date = new Date(updatedAt);
  const time = date.toLocaleTimeString("fi-FI", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const userNameInclude = (
    <div>{`${Messages[0].User.username}: ${Messages[0].content}`}</div>
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

const ChatList = () => {
  const chats = useAppSelector(selectChats);

  return (
    <ul className="max-w-1/3 overflow-y-auto overflow-x-hidden">
      {chats.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </ul>
  );
};

export const Sidebar = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { user, token } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user && token) {
      dispatch(getChats(token));
    }
  }, [user, dispatch, token]);

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

    const chatGroup = {
      name,
      users: users.split(",").map((user) => user.trim()),
    };
  };

  return (
    <section className="h-full w-1/3 border-collapse border">
      {/* modal */}
      {openModal && (
        <Modal
          openModal={handleOpenModal}
          handleCloseModal={handleCloseModal}
          handleCreateChat={handleCreateChat}
          cancelBtnRef={null}
        />
      )}
      <header className="flex flex-row items-center gap-2 bg-gray-200 px-3 py-2 dark:bg-gray-800">
        <div className="h-10 w-10">
          <Avatar />
        </div>
        <h1 className="text-xl">
          Welcome <span>{user?.username}</span>
        </h1>
        {/* plus icon to add room/group */}
        <div className="flex-grow"></div>
        <div className="flex-none" onClick={handleOpenModal}>
          <span className="text-2xl">+</span>
        </div>
      </header>

      {/* chats list */}
      <ChatList />
    </section>
  );
};
