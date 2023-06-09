import {
  removeChatInvite,
  updateFriendRequest,
  updateUser,
} from "features/auth/authSlice";
import { addChat } from "features/chats/chatsSlice";
import { rejectInvite, updateInviteStatus } from "features/invites/inviteSlice";
import { Invite } from "features/invites/types";
import { friendRequest } from "features/users/types";
import { useAuth } from "hooks/useAuth";
import { FC, useMemo } from "react";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { acceptFriendRequest, rejectFriendRequest } from "services/user";
import { useAppDispatch, useThunkDispatch } from "store";
import timeSince from "utils/timeSince";
import { InviteAttributes } from "../../../../shared/types";

type PendingInvite = Invite | friendRequest;

interface InviteItemProps {
  pendingInvite: PendingInvite;
  handleAccept: (
    invite: PendingInvite,
    isFriendRequest: boolean
  ) => Promise<void>;
  handleReject: (
    invite: PendingInvite,
    isFriendRequest: boolean
  ) => Promise<void>;
}

const InviteItem: FC<InviteItemProps> = ({
  pendingInvite,
  handleAccept,
  handleReject,
}) => {
  const isFriendRequest = pendingInvite.type === "friendRequest";

  const formatInviteMessage = (
    invite: PendingInvite,
    isFriendRequest: boolean
  ) => {
    if (isFriendRequest) {
      return `sent you a friend request`;
    }

    return "chat" in invite ? `invited you to join ${invite.chat.name}` : "";
  };

  const username =
    "username" in pendingInvite
      ? pendingInvite.username
      : pendingInvite.sender.username;

  return (
    <div className="flex flex-row items-center justify-center w-full space-x-2 grow-0">
      <div className="shrink-0">
        <img
          src={`https://avatars.dicebear.com/api/identicon/${username}.svg`}
          alt="avatar"
          className="object-cover w-8 h-8 rounded-full"
        />
      </div>
      <div className="w-full truncate">
        <div className="flex items-center justify-between w-full">
          <p className="font-semibold text-black dark:text-gray-300">
            {username}
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-gray-500 truncate ">
            {formatInviteMessage(pendingInvite, isFriendRequest)}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          {timeSince(new Date(pendingInvite.createdAt))} ago
        </p>
      </div>
      <div className="space-y-1">
        <IoMdCheckmark
          className="fill-emerald-500 hover:fill-green-800"
          size={24}
          onClick={() => handleAccept(pendingInvite, isFriendRequest)}
        />
        <IoMdClose
          className=" fill-rose-500 hover:fill-rose-900"
          size={24}
          onClick={() => handleReject(pendingInvite, isFriendRequest)}
        />
      </div>
    </div>
  );
};

const InviteList: FC = () => {
  const dispatch = useAppDispatch();
  const thunkDispatch = useThunkDispatch();
  const { user: currentUser, token } = useAuth();

  const handleAccept = async (
    invite: PendingInvite,
    isFriendRequest: boolean
  ): Promise<void> => {
    if (isFriendRequest) {
      console.log("accepting friend request", invite);
      const { userId, friendId } = invite as friendRequest;
      const data = await acceptFriendRequest(userId, friendId, token);
      dispatch(updateUser(data));
    } else {
      console.log("accepting invite", invite);
      const action = await thunkDispatch(
        updateInviteStatus({
          ...(invite as Invite),
          status: "accepted",
        })
      );

      if (action.meta.requestStatus === "fulfilled") {
        console.log("action.payload", action.payload);

        const result = action.payload as InviteAttributes;
        dispatch(addChat(result.chat));
        console.log("result", result);

        dispatch(removeChatInvite(result));
      }
    }
  };

  const handleReject = async (
    invite: PendingInvite,
    isFriendRequest: boolean
  ): Promise<void> => {
    if (isFriendRequest) {
      console.log("rejecting friend request", invite);
      const { userId, friendId } = invite as friendRequest;
      const response = await rejectFriendRequest(userId, friendId, token);
      dispatch(updateFriendRequest(response));
      console.log("response", response);
      return;
    }

    console.log("rejecting invite", invite);
    await thunkDispatch(rejectInvite(invite as Invite));
  };

  const pendingInvites = useMemo(
    (): Invite[] =>
      currentUser.chatInvites.invites
        .map((invite: InviteAttributes) => ({
          id: invite.id,
          createdAt: invite.createdAt,
          sender: currentUser.chatInvites.senders[invite.senderId],
          chat: currentUser.chatInvites.chats[invite.chatId],
          status: invite.status,
          type: "chatInvite",
        }))
        .filter((invite) => invite.status === "pending"),
    [currentUser.chatInvites]
  );

  const friendRequestsAndChatInvites = useMemo(
    () => [
      ...currentUser.friendRequests
        .map((friendRequest: friendRequest) => ({
          ...friendRequest,
          type: "friendRequest",
        }))
        .filter((friendRequest) => friendRequest.status === "pending"),
      ...pendingInvites,
    ],
    [currentUser.friendRequests, pendingInvites]
  );

  const sortedInvites: PendingInvite[] = useMemo(
    () =>
      friendRequestsAndChatInvites.sort(
        (a: friendRequest | Invite, b: friendRequest | Invite) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [friendRequestsAndChatInvites]
  );

  return !friendRequestsAndChatInvites.length ? (
    <div className="flex flex-col w-full p-2 space-y-4 divide-y">
      <p className="text-center">No new invites</p>
    </div>
  ) : (
    <div className="flex flex-col w-full p-2 space-y-4 overflow-scroll divide-y">
      {sortedInvites.map((pendingInvite) => (
        <InviteItem
          key={
            pendingInvite.type === "friendRequest"
              ? pendingInvite["userId"]
              : pendingInvite.id
          }
          pendingInvite={pendingInvite}
          handleAccept={handleAccept}
          handleReject={handleReject}
        />
      ))}
    </div>
  );
};

export default InviteList;
