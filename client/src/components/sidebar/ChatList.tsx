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
      : chat.users?.find((u: User) => u.id !== user.id)?.username;

  return (
    <li
      className={`max-w-full cursor-pointer p-1 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 ${activeChatClass}`}
      onClick={handleChatItemClick}
    >
      <div className="flex items-center space-x-2">
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
        <div className="flex w-full flex-col truncate">
          <div className="flex justify-between">
            <span className="max-w-[85%] truncate font-semibold">
              {nameToDisplay}
            </span>
            <span className="self-center whitespace-nowrap text-xs">
              {time}
            </span>
          </div>
          <p className="truncate text-sm">
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
export const ChatList = ({ chats }: Props) => {
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
    <ul className="w-full divide-y divide-gray-300 dark:divide-gray-700">
      {sortedChats?.map((chat) => (
        <ChatItem key={chat?.id} chat={chat} />
      ))}
    </ul>
  );
};
