import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import { useAppSelector } from "../store";

import { message } from "./Message";
import { Sidebar } from "./Sidebar";
import { Chat } from "./Chat";

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
    <main className="container mx-auto h-full text-neutral-900 dark:text-neutral-300">
      <div className="border-gray flex grow border-collapse rounded border shadow-lg">
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
