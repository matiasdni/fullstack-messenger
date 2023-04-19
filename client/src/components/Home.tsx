import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import { useAppDispatch, useAppSelector } from "../store";

import { Sidebar } from "./Sidebar";
import { Chat } from "./Chat";
import {
  getChats,
  selectActiveChat,
  selectChats,
  setActiveChat,
} from "../features/chats/chatsSlice";
import DarkModeToggle from "./DarkModeToggle";
import { Chat as ChatType } from "../features/chats/types";

export const Home = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [chatMessages, setChatMessages] = useState([]);
  const { user, token } = useAppSelector((state) => state.auth);
  const allChats = useAppSelector(selectChats);
  const activeChat = useAppSelector(selectActiveChat);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getChats(token)).then((action) => {
      // set active chat if current value is null
      console.log(activeChat);
      if (!activeChat) {
        dispatch(setActiveChat(action.payload[0]));
      }

      const chats = action.payload as Array<ChatType>;

      // subscribe to all chats
      // check if already subscribed
      chats.forEach((chat) => {
        const isSubscribed = socket.hasListeners(`message-${chat.id}`);
        if (!isSubscribed && chat.id) {
          // join chat room
          socket.emit("join-room", chat.id);

          // listen for events
          socket.on(`message-${chat.id}`, (data) => {
            console.log("message received");
            console.log(data);
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
  }, [activeChat, dispatch, token]);

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

    socket.auth = { token };
    socket.connect();
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [token, user]);

  useEffect(() => {
    // chat events
    const onChatMessage = (message) =>
      setChatMessages(chatMessages.concat(message));

    socket.on("message", onChatMessage);

    return () => {
      socket.off("chat-message", onChatMessage);
    };
  }, [chatMessages]);

  return (
    <div className="flex h-full flex-col text-neutral-900 dark:text-neutral-300">
      <div className="m-auto grid h-full min-w-fit grid-cols-5 grid-rows-1">
        <div className="col-span-1">
          <Sidebar chats={allChats} />
        </div>
        <div className="col-span-4 row-span-2">
          <Chat />
        </div>
      </div>
      <DarkModeToggle />
    </div>
  );
};
