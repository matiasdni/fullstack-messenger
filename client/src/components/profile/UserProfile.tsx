import { UserDetails } from "components/profile/UserDetails";
import { UserProfileHeader } from "components/profile/UserProfileHeader";
import { useUser } from "hooks/useAuth";
import { useEffect, useState } from "react";

export const UserProfile = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const user = useUser();
  const [image, setImage] = useState<string>(user?.image);
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [bio, setBio] = useState<string>(user?.bio);

  const current = {
    ...user,
    bio: "I am a cool person",
    github: "matiasdni",
  };

  useEffect(() => {
    setBio(user?.bio);
    setImage(user.image);
    console.log(user);
  }, [editMode, user]);

  return (
    <>
      <form className="flex flex-col p-4 ">
        <header>
          <UserProfileHeader
            current={current}
            user={user}
            editMode={editMode}
            setEditMode={setEditMode}
            image={image}
            setImage={setImage}
            formData={formData}
            setFormData={setFormData}
          />
        </header>
        <section>
          <UserDetails user={user} />
        </section>
      </form>
    </>
  );
};
