import { useEffect, useRef } from "react";
import { addMessage, getChatById } from "../features/chats/chatsSlice";
import { Chat, Message } from "../features/chats/types";
import { socket } from "../socket";
import { useAppDispatch, useAppSelector, useThunkDispatch } from "../store";

const useSocketEvents = (): void => {
  const dispatch = useAppDispatch();
  const dispatchThunk = useThunkDispatch();
  const { token, chats } = useAppSelector((state) => ({
    token: state.auth.token,
    chats: state.chats.chats,
  }));
  const chatsRef = useRef(chats);

  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  useEffect(() => {
    const onConnect = (): void => {
      console.log("socket connected");
      chatsRef.current.forEach((chat: Chat) =>
        socket.emit("join-room", chat.id)
      );
    };
    const onDisconnect = () => console.log("socket disconnected");

    const onMessage = async (data: Message): Promise<void> => {
      console.log("message received");
      const chat = chatsRef.current.find((chat) => chat.id === data.chatId);
      if (!chat) {
        await dispatchThunk(getChatById(data.chatId));
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
  }, [token, dispatch, dispatchThunk]);
};

export default useSocketEvents;
