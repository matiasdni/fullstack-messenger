import { useCallback, useMemo } from "react";
import {
  selectActiveChat,
  setActiveChat,
} from "../../features/chats/chatsSlice";
import { Chat } from "../../features/chats/types";
import { User } from "../../features/users/types";
import { useUser } from "../../hooks/useAuth";
import { useAppDispatch, useAppSelector } from "../../store";
import { Avatar } from "../common/Avatar";

const ChatItem = ({ chat }) => {
  const dispatch = useAppDispatch();
  const user = useUser();
  const activeChat = useAppSelector(selectActiveChat);
  const { name, messages } = chat;
  const lastMessage = messages?.[messages?.length - 1];

  const time = lastMessage?.createdAt
    ? new Date(lastMessage?.createdAt).toLocaleTimeString("fi-FI", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date(chat.updatedAt).toLocaleTimeString("fi-FI", {
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
      : chat.users?.find((u: User) => u.id !== user?.id)?.username;

  return (
    <li>
      <div
        className={`flex p-2 space-x-2 items-center cursor-pointer shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 ${activeChatClass}`}
        onClick={handleChatItemClick}
      >
        <figure className="h-10 w-10 flex-none">
          {chat.image ? (
            <img
              className="w-full h-full rounded-full"
              src={chat.image}
              alt=""
            />
          ) : (
            <Avatar />
          )}
        </figure>
        <div className="whitespace-nowrap truncate w-full">
          <div className="flex items-center justify-between">
            <span className={`${isActive ? "font-semibold" : ""} truncate`}>
              {nameToDisplay}
            </span>
            <span className=" text-xs">{time}</span>
          </div>
          <p className="truncate text-sm w-full">
            {(messages?.length > 0 &&
              (includeUsername ? userNameInclude : lastMessage.content)) ||
              "No messages"}
          </p>
        </div>
      </div>
    </li>
  );
};

export const ChatList = ({ chats }: { chats: Chat[] }) => {
  const sortedChats = useMemo(
    () =>
      [...chats].sort((a, b) => {
        const aTime =
          a.messages.length === 0
            ? a.createdAt
            : a.messages[a.messages.length - 1].createdAt;
        const bTime =
          b.messages.length === 0
            ? b.createdAt
            : b.messages[b.messages.length - 1].createdAt;

        return new Date(bTime).getTime() - new Date(aTime).getTime();
      }),
    [chats]
  );

  return (
    <ul className="h-full max-w-full divide-y overflow-hidden truncate overflow-y-auto overscroll-contain divide-gray-300 dark:divide-gray-700">
      {sortedChats?.map((chat) => (
        <ChatItem key={chat?.id} chat={chat} />
      ))}
    </ul>
  );
};
