import { User } from "features/users/types";

export function UserDetails({ user }: { user: User }) {
  return (
    <>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Bio</span>
        </label>
        <textarea
          placeholder="bio"
          className="h-24 resize-none textarea textarea-bordered"
          value={user?.bio}
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
          value={user?.github}
          readOnly
        />
      </div>
    </>
  );
}
