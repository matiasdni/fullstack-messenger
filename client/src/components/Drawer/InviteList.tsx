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
import { acceptFriendRequest, rejectFriendRequest } from "services/user";
import { useAppDispatch, useThunkDispatch } from "store";
import { InviteAttributes } from "../../../../shared/types";
import timeSince from "utils/timeSince";

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
    <>
      <div className="flex flex-row items-center p-2 space-x-4">
        <div className="relative py-2 flex-none">
          <img
            src={
              `https://api.dicebear.com/6.x/avataaars/svg?seed=${username}` ||
              ""
            }
            alt="avatar"
            className="block object-cover w-16 h-16 bg-gray-200 rounded-full"
          />
        </div>
        <div className="flex flex-col items-start w-full py-2 overflow-x-hidden">
          <div className="flex justify-between w-full place-items-center">
            <h5 className="inline text-sm font-medium text-primary dark:text-gray-300">
              {username}
            </h5>
            <small className="text-xs font-light dark:text-gray-400">
              {timeSince(new Date(pendingInvite.createdAt))} ago
            </small>
          </div>
          <small className="text-xs font-light dark:text-gray-400 w-full truncate">
            {formatInviteMessage(pendingInvite, isFriendRequest)}
          </small>

          <span className="inline-flex space-x-2 mt-1">
            <button
              className="py-1 px-3 capitalize rounded-lg text-white bg-emerald-500 shadow-sm text-xs duration-300 hover:bg-emerald-600"
              onClick={() => handleAccept(pendingInvite, isFriendRequest)}
            >
              accept
            </button>
            <button
              className="py-1 px-3 capitalize rounded-lg bg-[#ff4757] text-white shadow-sm dark:bg-primary text-xs duration-100 hover:bg-[#992a34]"
              onClick={() => handleReject(pendingInvite, isFriendRequest)}
            >
              reject
            </button>
          </span>
        </div>
      </div>
    </>
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
