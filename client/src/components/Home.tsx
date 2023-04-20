import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import { useAppDispatch, useAppSelector } from "../store";

import { Sidebar } from "./Sidebar";
import { Chat } from "./Chat";
import { addMessage, getChats } from "../features/chats/chatsSlice";
import DarkModeToggle from "./DarkModeToggle";
import { Chat as ChatType } from "../features/chats/types";

const LoadingChat: React.FC = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="loader mb-4 h-12 w-12 rounded-full border-4 border-t-4 border-solid border-gray-200"></div>
      <h2 className="text-center text-xl font-semibold">Loading chats...</h2>
    </div>
  );
};

export const Home = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    dispatch(getChats(auth.token)).then((action) => {
      const chats = action.payload as Array<ChatType>;

      chats.forEach((chat) => {
        const isSubscribed = socket.hasListeners(`message-${chat.id}`);
        if (!isSubscribed && chat.id) {
          // join chat room
          socket.emit("join-room", chat.id);

          // listen for events
          socket.on(`message-${chat.id}`, (data) => {
            console.log("message received", data, chat.id);
            dispatch(addMessage({ chatId: chat.id, message: data }));
          });

          socket.on(`typing-${chat.id}`, (data) => {
            console.log("typing received");
            console.log(data);
          });

          socket.on(`stop-typing-${chat.id}`, (data) => {
            console.log("stop typing received");
            console.log(data);
          });

          socket.on(`seen-${chat.id}`, (data) => {
            console.log("seen received");
            console.log(data);
          });

          return () => {
            socket.off(`message-${chat.id}`);
            socket.off(`typing-${chat.id}`);
            socket.off(`stop-typing-${chat.id}`);
            socket.off(`seen-${chat.id}`);
          };
        }
      });
    });

    console.log("socket", socket);
  }, [dispatch, auth]);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      console.log("socketio connected");
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log("socketio disconnected");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.auth = { token: auth.token };
    socket.connect();

    setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [auth]);

  if (loading) {
    return <LoadingChat />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden text-neutral-900 dark:text-neutral-300">
      <DarkModeToggle />
      <div className="flex-1">
        <div className="grid h-full grid-rows-1 sm:grid-cols-[1fr_5fr] md:grid-cols-auto-1fr">
          <Sidebar />
          <div className="relative overflow-hidden">
            <Chat />
          </div>
        </div>

        <DarkModeToggle />
      </div>
    </div>
  );
};
