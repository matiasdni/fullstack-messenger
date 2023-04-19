import { useEffect, useState } from "react";
import { User } from "../features/users/types";
import { socket } from "../socket";
import { useAppSelector } from "../store";
import { Avatar } from "./Avatar";
import { Message } from "./Message";
import { selectActiveChat } from "../features/chats/chatsSlice";

export const Chat = () => {
  const [input, setInput] = useState<string>("");
  const user = useAppSelector((state) => state.auth.user) as User;
  const activeChat = useAppSelector(selectActiveChat);

  useEffect(() => {
    socket.on(`message-${activeChat?.id}`, (data) => {
      console.log("message received");
      console.log(data);
    });

    return () => {
      socket.off("message");
    };
  }, [activeChat]);

  const sendMessage = (e) => {
    e.preventDefault();
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

  return activeChat?.name ? (
    <section className="flex h-full flex-col border">
      <header className="bg-grey-lighter items-center justify-between border px-3 py-2">
        <div className="flex items-center">
          <figure className="h-10 w-10">
            <Avatar />
          </figure>
          <div className="ml-4">
            <p>{activeChat?.name}</p>
            <p className="text-xs">
              {activeChat?.Users.map((user) => user.username).join(", ")}
            </p>
          </div>
        </div>
      </header>

      {/*messages*/}
      <div className="px-3 py-2">
        <div className="overflow-y-auto overflow-x-hidden border-0">
          {activeChat?.Messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </div>
      </div>
      <div className="flex-1"></div>

      {/*input*/}
      <div className="relative w-full">
        <form
          className="flex items-center justify-between bg-transparent p-3"
          onSubmit={sendMessage}
        >
          <input
            type="text"
            className="focus:shadow-outline form-input w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 leading-normal focus:outline-none dark:border-gray-700 dark:bg-gray-700"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            className="ml-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={sendMessage}
          >
            Send
          </button>
        </form>
      </div>
    </section>
  ) : (
    <section className="flex flex-col border">
      <header className="bg-grey-lighter flex flex-row  items-center justify-between px-3 py-2">
        <div className="flex items-center">
          <figure className="h-10 w-10">
            <Avatar />
          </figure>
          <div className="ml-4">
            <p>Chat</p>
            <p className="text-xs">No users</p>
          </div>
        </div>
      </header>
      {/*messages*/}
      <section className="flex-1 overflow-auto">
        <div className="px-3 py-2">
          <p className="text-center">No messages</p>
        </div>
      </section>
      {/*input*/}
      <div className="flex-1"></div>
    </section>
  );
};
