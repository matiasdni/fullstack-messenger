import { useAppDispatch } from "../store";
import { useEffect } from "react";
import { socket } from "../socket";
import { addMessage } from "../features/chats/chatsSlice";

export const useSocketEvents = (chats, auth) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const onConnect = () => {
      console.log("socketio connected");
    };

    const onDisconnect = () => {
      console.log("socketio disconnected");
    };

    const setUpChatListeners = (chatId) => {
      const messageEvent = `chat:message`;
      const typingEvent = `typing-${chatId}`;
      const stopTypingEvent = `stop-typing-${chatId}`;
      const seenEvent = `seen-${chatId}`;

      socket.emit("join-room", chatId);

      socket.on(messageEvent, (data) => {
        dispatch(addMessage(data));
      });

      socket.on(typingEvent, (data) => {
        console.log(data);
      });

      socket.on(stopTypingEvent, (data) => {
        console.log(data);
      });

      socket.on(seenEvent, (data) => {
        console.log(data);
      });

      return () => {
        socket.off(messageEvent);
        socket.off(typingEvent);
        socket.off(stopTypingEvent);
        socket.off(seenEvent);
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
