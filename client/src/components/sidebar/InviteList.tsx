import { FC, useEffect } from "react";
import { useAuth } from "src/hooks/useAuth";
import { IoMdClose, IoMdCheckmark } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  updateInviteStatus,
  getInvites,
  selectInvites,
  rejectInvite,
} from "src/features/invites/inviteSlice";
import { Invite } from "src/features/invites/types";
import { addChat } from "src/features/chats/chatsSlice";

const timeSince = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
};

const InviteList: FC = () => {
  const dispatch = useAppDispatch();
  const invites = useAppSelector(selectInvites);
  const { user } = useAuth();
  const userId = user.id;

  useEffect(() => {
    console.log("fetching invites");
    dispatch(getInvites(userId));
  }, [dispatch, userId]);

  const handleAccept = async (invite: Invite): Promise<void> => {
    const result = await dispatch(
      updateInviteStatus({ ...invite, status: "accepted" })
    );

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(addChat(invite.chat));
    }
  };

  const handleReject = (invite: Invite): void => {
    console.log("rejecting invite", invite);
    dispatch(rejectInvite(invite));
  };

  return (
    <div className="flex w-full flex-col space-y-4 divide-y p-2">
      {invites.map((invite) => (
        <div
          key={invite.id}
          className="flex w-full flex-row items-center justify-center space-x-2"
        >
          <div className="shrink-0">
            <img
              src={`https://avatars.dicebear.com/api/identicon/${invite.sender.username}.svg`}
              alt="avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
          <div className="w-full">
            <div className="flex w-full items-center justify-between">
              <p className="font-semibold text-black dark:text-gray-300">
                {invite.sender.username}
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-500">
                invited you to join {invite.chat.name}
                <span>{invite.chat.name}</span>
              </p>
            </div>
            <p className="text-xs text-gray-500">
              {timeSince(new Date(invite.createdAt))} ago
            </p>
          </div>
          <div className="space-y-1">
            <IoMdCheckmark
              className="fill-emerald-500 hover:fill-green-800"
              size={24}
              onClick={() => handleAccept(invite)}
            />
            <IoMdClose
              className=" fill-rose-500 hover:fill-rose-900"
              size={24}
              onClick={() => handleReject(invite)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default InviteList;
