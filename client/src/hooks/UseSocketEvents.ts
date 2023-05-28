import { useAppDispatch } from "../store";
import { useEffect } from "react";
import { socket } from "../socket";
import { addMessage, getChatById } from "../features/chats/chatsSlice";

export const useSocketEvents = (chats, auth) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const onConnect = () => {
      console.log("socketio connected");
    };

    const onDisconnect = () => {
      console.log("socketio disconnected");
    };

    const log = (event, ...args) => {
      console.log(`got ${event}`, args);
    };

    socket.onAny(log);

    const messageEvent = `chat:message`;
    const setUpChatListeners = (chatId) => {
      socket.emit("join-room", chatId);
    };

    socket.on("join-room", (chatId) => {
      console.log("join-room", chatId);
      socket.emit("join-room", chatId);
    });

    socket.on("invite", (chat) => {
      console.log("invite", chat);
    });

    socket.on(messageEvent, async (data) => {
      console.log("message received", data);
      const chat = chats.find((chat) => chat.id === data.chatId);
      if (!chat) {
        await dispatch(getChatById(data.chatId));
      } else {
        dispatch(addMessage(data));
      }
    });

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.auth = { token: auth.token };
    socket.connect();

    chats.forEach((chat) => setUpChatListeners(chat.id));
    console.log(auth);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("join-room");
      socket.offAny(log);
      socket.off(messageEvent);
      socket.disconnect();
    };
  }, [auth.token]);
};
