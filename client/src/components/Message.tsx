import React from "react";
import { useAppSelector } from "../store";

export type message = {
  content: string;
  date: Date;
  author: string;
};

interface MessageProps {
  message: message;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const { content, date, author } = message;
  const username = useAppSelector((state) => state.auth.user?.username);

  const getTime = (message: message): string => {
    const date = new Date(message.date);
    return date
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        localeMatcher: "best fit",
      })
      .replace(".", ":");
  };

  return author === username ? (
    <div className="flex justify-end mb-2">
      <div className="min-w-[20%] rounded py-2 px-3 bg-sky-200 dark:bg-sky-700">
        <p className="text-sm mt-1">{content}</p>
        <p className="text-right text-xs text-grey-dark mt-1">
          {getTime(message)}
        </p>
      </div>
    </div>
  ) : (
    <div>
      <div className="flex mb-2">
        <div className="min-w-[20%] rounded py-2 px-3 bg-gray-200 dark:bg-gray-700 bg-opacity-70">
          <p className="text-sm text-teal">{author}</p>
          <p className="text-sm mt-1">{content}</p>
          <p className="text-right text-xs text-grey-dark mt-1">
            {getTime(message)}
          </p>
        </div>
      </div>
    </div>
  );
};
