import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { Avatar } from "../common/Avatar";
import { User } from "../../features/users/types";
import {
  selectActiveChat,
  setActiveChat,
} from "../../features/chats/chatsSlice";
import { Chat } from "../../features/chats/types";

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
export const ChatList = ({ chats }: Props) => {
  return (
    <ul>
      {chats?.map((chat) => (
        <ChatItem key={chat?.id} chat={chat} />
      ))}
    </ul>
  );
};