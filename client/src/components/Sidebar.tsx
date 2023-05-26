import { useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { Avatar } from "./common/Avatar";
import { User } from "../features/users/types";
import { selectActiveChat, setActiveChat } from "../features/chats/chatsSlice";
import { Modal } from "./common/Modal";
import { UserSearch } from "./UserSearch";
import { GroupForm } from "./GroupForm";
import { Chat } from "../features/chats/types";

const ChatItem = ({ chat }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const activeChat = useAppSelector(selectActiveChat);
  const { name, messages } = chat;
  const lastMessage = messages?.[messages?.length - 1];
  const time = new Date(lastMessage?.createdAt).toLocaleTimeString("fi-FI", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const userNameInclude = (
    <span>{`${lastMessage?.user.username}: ${lastMessage?.content}`}</span>
  );

  const handleChatItemClick = useCallback(() => {
    dispatch(setActiveChat(chat.id));
  }, [chat.id, dispatch]);

  const includeUsername = chat.users?.length > 1;

  const isActive = chat.id === activeChat?.id;
  const activeChatClass = isActive ? "bg-gray-200 dark:bg-gray-800" : "";

  const nameToDisplay =
    chat.chat_type === "group"
      ? name
      : chat.users?.find((u: User) => u.id !== user.id)?.username;

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
          <div className="flex w-full flex-row flex-wrap items-center justify-between">
            <p className="font-bold">{nameToDisplay}</p>
            <div className="flex flex-row items-center gap-2"></div>
            <p className="text-xs">{time}</p>
          </div>
          <p className="truncate align-top text-sm">
            {(messages?.length > 0 &&
              (includeUsername ? userNameInclude : lastMessage.content)) ||
              "No messages"}
          </p>
        </div>
      </div>
    </li>
  );
};

type Props = {
  chats: Chat[];
};

const ChatList = ({ chats }: Props) => {
  return (
    <ul>
      {chats?.map((chat) => (
        <ChatItem key={chat?.id} chat={chat} />
      ))}
    </ul>
  );
};

interface SidebarHeaderProps {
  user: User;
}

const SidebarHeader = ({ user }: SidebarHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const handleGroupModalClose = () => {
    setIsGroupModalOpen(false);
  };

  return (
    <>
      <div className="w-full bg-gray-200 px-3 py-2 dark:bg-gray-800">
        <div className="flex items-center">
          <div className="h-10 w-10">
            <Avatar />
          </div>
          <div className="w-3"></div>
          <h1 className="text-center text-xl">
            Welcome, <span>{user?.username}</span>
          </h1>
        </div>
        <button
          className="max-w-md cursor-pointer rounded border-2 border-gray-300 px-3 py-1 text-left dark:border-gray-700"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Start a new chat...
        </button>

        <div
          className="cursor-pointer justify-self-end"
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

      {isModalOpen && (
        <Modal
          handleCloseModal={() => {
            setIsModalOpen(false);
          }}
        >
          <UserSearch />
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

  const sortedChats = useMemo(
    () =>
      allChats
        .map((chat) => ({ ...chat }))
        .sort((a, b) => {
          const aLastMessage = a.messages[a.messages.length - 1];
          const bLastMessage = b.messages[b.messages.length - 1];
          if (!aLastMessage) return 1;
          if (!bLastMessage) return -1;
          return (
            new Date(bLastMessage.createdAt).getTime() -
            new Date(aLastMessage.createdAt).getTime()
          );
        }),
    [allChats]
  );

  return (
    <>
      <div className="flex">
        <div className="flex h-full w-full flex-col">
          <SidebarHeader user={user} />

          <div className="flex h-full w-full overflow-auto">
            {/* chats list */}
            <ChatList chats={sortedChats} />
          </div>
        </div>
      </div>
    </>
  );
};
