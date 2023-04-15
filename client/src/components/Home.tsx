import React, { useEffect, useState } from "react";
import { useAppSelector } from "../store";
import { Avatar } from "./Avatar";
import { Chat } from "./Chat";
import { socket } from "../socket";
import { message } from "./Message";

const ChatItem = ({ chatName, lastMessage, time }) => {
  return (
    <li className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
      <div className="flex p-3 items-center">
        <figure className="flex-none h-10 w-10 min-w-10">
          <Avatar />
        </figure>
        <div className="flex flex-col justify-center overflow-hidden ml-2">
          <div className="flex grow flex-nowrap flex-row items-center justify-between whitespace-nowrap">
            <p className="font-bold">{chatName}</p>

            <p className="text-xs">{time}</p>
          </div>
          <p className="text-sm truncate align-top">
            asdsadsadsadsadasdasdsadasdasdasuuiuhiuihuihuhihuiuhiuihuhi
          </p>
        </div>
      </div>
    </li>
  );
};

const ChatList = () => {
  return (
    <ul className="overflow-y-auto max-w-1/3 overflow-x-hidden">
      <ChatItem chatName="Chat 1" lastMessage="Hello" time="12:00" />
      <ChatItem chatName="Chat 2" lastMessage="Hello" time="12:00" />
      <ChatItem chatName="Chat 3" lastMessage="Hello" time="12:00" />
    </ul>
  );
};

const Sidebar = () => {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <section className="w-1/3 border border-collapse">
      <header className="py-2 gap-2 px-3 bg-gray-200 dark:bg-gray-800 flex flex-row items-center">
        <div className="h-10 w-10">
          <Avatar />
        </div>
        <h1 className="text-xl">
          Welcome <span>{user?.username}</span>
        </h1>
      </header>

      {/* chats list */}
      <ChatList />
    </section>
  );
};

export const Home = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [chatEvents, setChatEvents] = useState<message[]>([]);
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      console.log("socketio connected");
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log("socketio disconnected");
    };
    if (user) {
      socket.auth = { token };
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.connect();
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [user]);

  useEffect(() => {
    // chat events
    const onChatMessage = (message) =>
      setChatEvents(chatEvents.concat(message));

    socket.on("message", onChatMessage);

    return () => {
      socket.off("chat-message", onChatMessage);
    };
  }, [chatEvents]);

  return (
    <main className="container mx-auto text-neutral-900 dark:text-neutral-300">
      <div className="flex border border-gray border-collapse rounded shadow-lg">
        <Sidebar />
        <Chat
          chatEvents={chatEvents}
          setChatEvents={setChatEvents}
          chat={{ id: "1", name: "Chat 1", users: ["user1", "user2"] }}
        />
      </div>
    </main>
  );
};
