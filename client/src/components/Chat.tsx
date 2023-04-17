import React, { useState } from "react";
import { User } from "../features/users/types";
import { socket } from "../socket";
import { useAppSelector } from "../store";
import { Avatar } from "./Avatar";
import { message, Message } from "./Message";

type TChat = {
  id: string;
  name: string;
  users: string[];
};

interface ChatProps {
  chat: TChat;
  chatEvents: message[];
  setChatEvents: React.Dispatch<React.SetStateAction<message[]>>;
}

export const Chat: React.FC<ChatProps> = ({
  chat,
  chatEvents,
  setChatEvents,
}) => {
  const [input, setInput] = useState<string>("");
  const { id, name, users } = chat;
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.auth.user) as User;

  const sendMessage = () => {
    if (input.trim().length > 0) {
      try {
        socket.timeout(2000).emit("message", {
          content: input,
          author: user?.username,
        });
        setInput("");
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <section className="flex w-2/3 flex-col border">
      <header className="bg-grey-lighter flex flex-row  items-center justify-between px-3 py-2">
        <div className="flex items-center">
          <figure className="h-10 w-10">
            <Avatar />
          </figure>
          <div className="ml-4">
            <p>{name}</p>
            <p className="text-xs">{users.join(", ")}</p>
          </div>
        </div>
      </header>
      {/*messages*/}
      <section className="flex-1 overflow-auto">
        <div className="px-3 py-2">
          {chatEvents.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </div>
      </section>
      {/*input*/}
      <div className="flex-1">
        <form className="form-textarea flex h-full w-full flex-row items-center justify-between bg-transparent p-3">
          <textarea
            inputMode="text"
            className="focus:shadow-outline textarea form-textarea form-input h-10 max-h-56 w-full grow resize-y appearance-none flex-wrap overflow-y-hidden whitespace-pre-wrap rounded-lg border border-gray-300 bg-white px-4 leading-normal focus:outline-none dark:border-gray-700 dark:bg-gray-700"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
          ></textarea>
          {/*<input*/}
          {/*  type="text"*/}
          {/*  className="focus:shadow-outline form- w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 leading-normal focus:outline-none dark:border-gray-700 dark:bg-gray-700"*/}
          {/*  value={input}*/}
          {/*  onChange={(e) => setInput(e.target.value)}*/}
          {/*  placeholder="Type a message..."*/}
          {/*  disabled={isLoading}*/}
          {/*/>*/}
          <button
            className="ml-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={sendMessage}
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
};
