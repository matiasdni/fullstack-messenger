import { FC } from "react";
import { useUser } from "src/hooks/useAuth";
import { IoMdClose, IoMdCheckmark } from "react-icons/io";
import { useAppDispatch } from "../../store";
import {
  updateInviteStatus,
  rejectInvite,
} from "src/features/invites/inviteSlice";
import { Invite } from "src/features/invites/types";
import { addChat } from "src/features/chats/chatsSlice";
import { InviteAttributes } from "../../../../shared/types";
import { User, friendRequest } from "src/features/users/types";
import timeSince from "src/utils/timeSince";

const InviteList: FC = () => {
  const dispatch = useAppDispatch();
  const currentUser: User = useUser();

  const handleAccept = async (invite: Invite): Promise<void> => {
    const action = await dispatch(
      updateInviteStatus({ ...invite, status: "accepted" })
    );

    if (action.meta.requestStatus === "fulfilled") {
      const result = action.payload as InviteAttributes;
      console.log("accepted invite", result);
      dispatch(addChat(result.chat));
    }
  };

  const handleReject = (invite: Invite): void => {
    console.log("rejecting invite", invite);
    dispatch(rejectInvite(invite));
  };

  const getPendingInvites = () => {
    return currentUser.chatInvites.invites
      .map((invite) => ({
        id: invite.id,
        createdAt: invite.createdAt,
        sender: currentUser.chatInvites.senders[invite.senderId],
        chat: currentUser.chatInvites.chats[invite.chatId],
        status: invite.status,
      }))
      .filter((invite) => invite.status === "pending");
  };

  const pendingInvites = getPendingInvites();

  const friendRequestsAndChatInvites = [
    ...currentUser.friendRequests,
    ...pendingInvites,
  ];

  if (!friendRequestsAndChatInvites.length) {
    return (
      <div className="flex w-full flex-col space-y-4 divide-y p-2">
        <p className="text-center">No new invites</p>
      </div>
    );
  }

  const sortedInvites = friendRequestsAndChatInvites.sort(
    (a: friendRequest | Invite, b: friendRequest | Invite) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex w-full flex-col space-y-4 divide-y p-2">
      {sortedInvites.map((pendingInvite) => (
        <div
          key={pendingInvite.id}
          className="flex w-full flex-row items-center justify-center space-x-2"
        >
          <div className="shrink-0">
            <img
              // src={`https://avatars.dicebear.com/api/identicon/${invite.sender.username}.svg`}
              alt="avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
          <div className="w-full">
            <div className="flex w-full items-center justify-between">
              <p className="font-semibold text-black dark:text-gray-300">
                {/* {invite.sender.username} */}
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-500">
                {/* invited you to join <span>{invite.chat.name}</span> */}
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
              // onClick={() => handleAccept(invite)}
            />
            <IoMdClose
              className=" fill-rose-500 hover:fill-rose-900"
              size={24}
              // onClick={() => handleReject(invite)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default InviteList;
