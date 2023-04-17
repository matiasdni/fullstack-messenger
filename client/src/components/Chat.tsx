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
    <section className="w-2/3 border flex flex-col">
      <header className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
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
        <div className="py-2 px-3">
          {chatEvents.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </div>
      </section>
      {/*input*/}
      <div className="flex-none">
        <div className="flex flex-row items-center justify-between p-3">
          <input
            type="text"
            className="bg-white dark:bg-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
};
