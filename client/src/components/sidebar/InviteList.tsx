import { FC, useEffect, useState } from "react";
import { Invite } from "src/features/users/types";
import { useAuth } from "src/hooks/useAuth";
import { fetchUserRequests } from "src/services/user";
import { IoMdClose, IoMdCheckmark } from "react-icons/io";

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
  const [requests, setRequests] = useState<Invite[]>([]);
  const { user, token } = useAuth();
  const userId = user.id;

  useEffect(() => {
    console.log("fetching invites");
    fetchUserRequests(userId, token).then((data) => {
      console.log("invites: ", data);
      // Process the data to make it easier to use in the component
      const invites: Invite[] = data.invites.map((invite) => ({
        id: invite.id,
        createdAt: new Date(invite.createdAt),
        sender: data.senders[invite.senderId],
        chat: data.chats[invite.chatId],
      }));
      console.log(
        "invites: ",
        invites[0].createdAt,
        typeof invites[0].createdAt
      );
      setRequests(invites);
    });
  }, [userId, token, setRequests]);

  return (
    <div className="flex w-full flex-col space-y-4 p-2">
      {requests.map((invite) => (
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
          <div className="flex flex-col items-center justify-center space-y-1 p-1">
            <IoMdCheckmark
              className="fill-emerald-600 hover:fill-green-800"
              size={24}
            />
            <IoMdClose className="fill-rose-600 hover:fill-red-800" size={24} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default InviteList;
