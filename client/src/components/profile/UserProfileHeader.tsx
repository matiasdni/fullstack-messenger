import { friendRequest, User } from "features/users/types";
import { GetPendingInvitesOutput } from "../../../../shared/types";

export function UserProfileHeader(props: {
  current: {
    friendRequests?: friendRequest[];
    image?: string;
    github: string;
    sentFriendRequests?: friendRequest[];
    bio: string;
    id: string;
    chatInvites?: GetPendingInvitesOutput;
    friends?: User[];
    username: string;
  };
  user: User;
}) {
  return (
    <header>
      <button className="btn-sm btn-circle btn-ghost absolute right-2 top-2">
        ✕
      </button>
      <h3 className="font-bold text-lg">{props.current?.username}'s Profile</h3>
      <div className="flex flex-col items-center justify-center">
        <img
          className="w-32 h-32 rounded-full"
          src={`https://avatars.dicebear.com/api/identicon/${props.user?.username}.svg`}
          alt=""
        />
        <p className="text-lg">{props.current?.username}</p>
        <p className="text-sm text-neutral-content">
          user since: {new Date().toLocaleString()}
        </p>
      </div>
    </header>
  );
}
