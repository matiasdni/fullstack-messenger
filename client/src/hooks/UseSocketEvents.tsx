import { useAppDispatch, useAppSelector } from "../store";
import { useEffect } from "react";
import { socket } from "../socket";
import {
  addChat,
  addMessage,
  setActiveChat,
} from "../features/chats/chatsSlice";

export const useSocketEvents = (chats, auth) => {
  const dispatch = useAppDispatch();
  const chatsState = useAppSelector((state) => state.chats);

  useEffect(() => {
    const onConnect = () => {
      console.log("socketio connected");
    };

    const onDisconnect = () => {
      console.log("socketio disconnected");
    };

    const setUpChatListeners = (chatId) => {
      const messageEvent = `chat:message`;

      socket.emit("join-room", chatId);

      socket.on(messageEvent, (data) => {
        console.log("message received", data);
        const chat = chatsState.chats.find((chat) => chat.id === data.chatId);
        if (!chat) {
          socket.emit("get:chatById", data.chatId);
        } else {
          dispatch(addMessage(data));
        }
      });

      socket.on("get:chatById", (data) => {
        const existingChat = chatsState.chats.find(
          (chat) => chat.id === data.id
        );
        if (!existingChat) {
          dispatch(addChat(data));
          console.log("add new chat to store");
        } else {
          console.log("chat already exists in store");
        }
      });

      socket.on("get:chatByUserId", (data) => {
        console.log(data);
        const existingChat = chatsState.chats.find(
          (chat) => chat.id === data.id
        );
        if (!existingChat) {
          dispatch(addChat(data));
          console.log("add new chat to store");
        } else {
          console.log("chat already exists in store");
        }
        setActiveChat(data);
      });

      socket.on("join-room", (chatId) => {
        socket.emit("join-room", chatId);
      });

      return () => {
        socket.off("get:chat");
        socket.off("get:chatById");
        socket.off("get:chatByUserId");
        socket.off("join-room");
      };
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.auth = { token: auth.token };
    socket.connect();

    const chatCleanupFns = chats.map((chat) => setUpChatListeners(chat.id));

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
      chatCleanupFns.forEach((cleanupFn) => cleanupFn());
    };
  }, [auth, chats, dispatch]);
};
