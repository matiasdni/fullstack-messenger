import { FC, useMemo } from "react";
import { useAuth } from "src/hooks/useAuth";
import { IoMdClose, IoMdCheckmark } from "react-icons/io";
import { useAppDispatch } from "../../store";
import {
  updateInviteStatus,
  rejectInvite,
} from "src/features/invites/inviteSlice";
import { Invite } from "src/features/invites/types";
import { addChat } from "src/features/chats/chatsSlice";
import { InviteAttributes } from "../../../../shared/types";
import { friendRequest } from "src/features/users/types";
import timeSince from "src/utils/timeSince";
import { acceptFriendRequest, rejectFriendRequest } from "src/services/user";
import { updateFriendRequest } from "src/features/auth/authSlice";

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
    <div className="flex w-full flex-row items-center justify-center space-x-2">
      <div className="shrink-0">
        <img
          src={`https://avatars.dicebear.com/api/identicon/${username}.svg`}
          alt="avatar"
          className="h-8 w-8 rounded-full object-cover"
        />
      </div>
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <p className="font-semibold text-black dark:text-gray-300">
            {username}
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-gray-500">
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
  const { user: currentUser, token } = useAuth();

  const handleAccept = async (
    invite: PendingInvite,
    isFriendRequest: boolean
  ): Promise<void> => {
    if (isFriendRequest) {
      console.log("accepting friend request", invite);
      const { userId, id: friendId } = invite as friendRequest;
      const data = await acceptFriendRequest(userId, friendId, token);
      dispatch(updateFriendRequest(data));
    } else {
      console.log("accepting invite", invite);
      const action = await dispatch(
        updateInviteStatus({ ...(invite as Invite), status: "accepted" })
      );

      if (action.meta.requestStatus === "fulfilled") {
        const result = action.payload as InviteAttributes;
        console.log("accepted invite", result);
        dispatch(addChat(result.chat));
      }
    }
  };

  const handleReject = async (
    invite: PendingInvite,
    isFriendRequest: boolean
  ): Promise<void> => {
    if (isFriendRequest) {
      console.log("rejecting friend request", invite);
      const { userId, id: friendId } = invite as friendRequest;
      const response = await rejectFriendRequest(userId, friendId, token);
      dispatch(updateFriendRequest(response));
      console.log("response", response);
      return;
    }

    console.log("rejecting invite", invite);
    await dispatch(rejectInvite(invite as Invite));
  };

  const pendingInvites = useMemo(
    (): Invite[] =>
      currentUser.chatInvites.invites
        .map((invite) => ({
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
        .map((friendRequest) => ({
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
    <div className="flex w-full flex-col space-y-4 divide-y p-2">
      <p className="text-center">No new invites</p>
    </div>
  ) : (
    <div className="flex w-full flex-col space-y-4 divide-y p-2">
      {sortedInvites.map((pendingInvite) => (
        <InviteItem
          key={pendingInvite.id}
          pendingInvite={pendingInvite}
          handleAccept={handleAccept}
          handleReject={handleReject}
        />
      ))}
    </div>
  );
};

export default InviteList;
