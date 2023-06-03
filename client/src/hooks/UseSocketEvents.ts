import { useAppDispatch, useAppSelector } from "../store";
import { useEffect, useRef } from "react";
import { socket } from "../socket";
import { addMessage, getChatById } from "../features/chats/chatsSlice";

const useSocketEvents = () => {
  const dispatch = useAppDispatch();
  const { token, chats } = useAppSelector((state) => ({
    token: state.auth.token,
    chats: state.chats.chats,
  }));
  const chatsRef = useRef(chats);

  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  useEffect(() => {
    const onConnect = () => {
      console.log("socket connected");
      chatsRef.current.forEach((chat) => socket.emit("join-room", chat.id));
    };
    const onDisconnect = () => console.log("socket disconnected");

    const onMessage = async (data) => {
      console.log("message received");
      const chat = chatsRef.current.find((chat) => chat.id === data.chatId);
      if (!chat) {
        await dispatch(getChatById(data.chatId));
      } else {
        dispatch(addMessage(data));
      }
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);

    socket.auth = { token };
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      chatsRef.current.forEach((chat) => socket.emit("leave-room", chat.id));
      socket.off("message", onMessage);
      socket.disconnect();
    };
  }, [token, dispatch]);
};

export default useSocketEvents;
