import { Invite } from "src/features/users/types";

type InviteListProps = {
  invites: Invite[];
};

const InviteList = ({ invites }: InviteListProps) => {
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

  return (
    <div className="flex w-full flex-col space-y-4 p-2">
      {invites.map((invite) => (
        <div
          key={invite.id}
          className="flex w-full flex-row items-center space-x-2"
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
                {invite.message + " "}
                <span>{invite.chat.name}</span>
              </p>
            </div>
            <p className="text-xs text-gray-500">
              {timeSince(new Date(invite.createdAt))} ago
            </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="inline-block h-5 w-5 fill-green-500 hover:fill-green-600"
            >
              <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              className="inline-block h-5 w-5 fill-red-500 hover:fill-red-600"
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InviteList;
