import { socket } from "@/app/socket";
import { useAppDispatch, useAppSelector } from "@/app/store";
import * as socketHandlers from "features/socket/socketHandlers";
import { useEffect, useRef } from "react";

const useSocket = () => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector((state) => state.chats.chats);
  const chatsRef = useRef(chats);

  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  useEffect(() => {
    const eventHandlers = {
      connect: socketHandlers.onConnect(chatsRef),
      disconnect: socketHandlers.onDisconnect,
      message: socketHandlers.onMessage(chatsRef, dispatch),
      "friend-request": socketHandlers.onFriendRequest(dispatch),
      "friend-request-accepted":
        socketHandlers.onFriendRequestAccepted(dispatch),
      userUpdate: socketHandlers.onUserUpdate(dispatch),
      chatUpdate: socketHandlers.onChatUpdate(dispatch),
      "chat-invite": socketHandlers.onChatInvite(dispatch),
      "leave-room": socketHandlers.onLeaveRoom,
    };

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(eventHandlers).forEach(([event]) => {
        socket.off(event);
      });
    };
  }, [dispatch]);

  return socket;
};

export default useSocket;
