import { useUser } from "hooks/useAuth";
import { UserDetails } from "components/profile/UserDetails";
import { UserProfileHeader } from "components/profile/UserProfileHeader";

export const UserProfile = () => {
  const user = useUser();
  const current = {
    ...user,
    bio: "I am a cool person",
    github: "matiasdni",
  };
  return (
    <>
      <dialog id="user_profile" className="modal modal-bottom sm:modal-middle">
        <form method="dialog" className="modal-box">
          <UserProfileHeader current={current} user={user} />
          <UserDetails current={current} />
          <div className="modal-action"></div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
