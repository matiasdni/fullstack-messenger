import { friendRequest, User } from "features/users/types";
import { GetPendingInvitesOutput } from "../../../../shared/types";

export function UserDetails(props: {
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
}) {
  return (
    <>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Bio</span>
        </label>
        <textarea
          placeholder="bio"
          className="textarea textarea-bordered h-24 resize-none"
          value={props.current?.bio}
          readOnly
        ></textarea>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Github</span>
        </label>
        <input
          type="text"
          placeholder="github"
          className="input input-bordered"
          value={props.current?.github}
          readOnly
        />
      </div>
    </>
  );
}
