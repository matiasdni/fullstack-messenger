import {
  addChatInvite,
  addFriend,
  addFriendRequest,
  removeFriendRequest,
  updateUser,
} from "@/features/auth/authSlice";
import { useEffect, useRef } from "react";
import {
  addMessage,
  getChatById,
  updateChat,
} from "../features/chats/chatsSlice";
import { Chat, Message } from "../features/chats/types";
import { User, friendRequest } from "../features/users/types";
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

    const onFriendRequest = (data: any) => {
      console.log("friend request received");
      dispatch(addFriendRequest(data));
    };

    const onFriendRequestAccepted = (data: {
      friendRequest: friendRequest;
      newFriend: User;
    }) => {
      console.log("friend request accepted");
      dispatch(addFriend(data.newFriend));
      dispatch(removeFriendRequest(data.friendRequest));
    };

    const onChatInvite = (data: any) => dispatch(addChatInvite(data));

    /**
     * TODO: implement socket.on("userUpdate", onUserUpdate); to update the current users data whenever it changes
     * TODO: refactor all the related code to use the new event so we dont need to specify every change we want to listen to
     **/

    const onUserUpdate = (data) => dispatch(updateUser(data));
    const onChatUpdate = (data) => dispatch(updateChat(data));

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);
    socket.on("friend-request", onFriendRequest);
    socket.on("friend-request-accepted", onFriendRequestAccepted);
    socket.on("userUpdate", onUserUpdate);
    socket.on("chatUpdate", onChatUpdate);
    socket.on("chat-invite", onChatInvite);

    socket.auth = { token };
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      chatsRef.current.forEach((chat) => socket.emit("leave-room", chat.id));
      socket.off("message", onMessage);
      socket.off("friend-request", onFriendRequest);
      socket.off("friend-request-accepted", onFriendRequestAccepted);
      socket.off("userUpdate", onUserUpdate);
      socket.off("chatUpdate", onChatUpdate);
      socket.off("chat-invite", onChatInvite);
      socket.disconnect();
    };
  }, [token, dispatch, dispatchThunk]);
};

export default useSocketEvents;
