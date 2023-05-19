import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { Avatar } from "./common/Avatar";
import { User } from "../features/users/types";
import { selectActiveChat, setActiveChat } from "../features/chats/chatsSlice";
import { Modal } from "./common/Modal";
import { UserSearchModal } from "./UserSearchModal";
import { GroupForm } from "./GroupForm";

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
          <div className="flex w-full flex-row flex-wrap items-center justify-between whitespace-nowrap">
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
}

const SidebarHeader = ({ user }: SidebarHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState<boolean>(false);

  const handleGroupModalClose = () => {
    setIsGroupModalOpen(false);
  };

  return (
    <>
      <div className="grid grid-rows-2 gap-2 bg-gray-200 px-3 py-2 dark:bg-gray-800">
        <div className="grid grid-cols-3 items-center">
          <div className="col-span-2 flex items-center">
            <div className="h-10 w-10">
              <Avatar />
            </div>
            <div className="w-3"></div>
            <h1 className="text-center text-xl">
              Welcome, <span>{user?.username}</span>
            </h1>
          </div>

          <div
            className="col-start-3 cursor-pointer justify-self-end"
            onClick={() => {
              setIsGroupModalOpen(true);
            }}
          >
            <svg
              viewBox="0 0 1024 1024"
              fill="currentColor"
              className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z" />
              <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z" />
            </svg>
          </div>
        </div>
        <button
          className="w-full cursor-pointer rounded border-2 border-gray-300 px-3 py-1 text-left dark:border-gray-700"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Start a new chat...
        </button>
      </div>
      {isModalOpen && (
        <Modal
          handleCloseModal={() => {
            setIsModalOpen(false);
          }}
        >
          <UserSearchModal />
        </Modal>
      )}
      {isGroupModalOpen && (
        <Modal handleCloseModal={handleGroupModalClose}>
          <GroupForm
            handleCloseModal={() => {
              setIsGroupModalOpen(false);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export const Sidebar = () => {
  const allChats = useAppSelector((state) => state.chats.chats);
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="flex h-full max-w-[520px] flex-col overflow-y-auto overflow-x-hidden border border-r-0">
      <SidebarHeader user={user} />
      {/* chats list */}
      <ChatList chats={allChats} />
    </div>
  );
};
