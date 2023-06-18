import { friendRequest, User } from "features/users/types";
import React, { useCallback } from "react";
import { FaGithub } from "react-icons/fa";
import { GetPendingInvitesOutput } from "../../../../shared/types";

export function UserProfileHeader(props: {
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
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
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const { editMode, setEditMode, image, setImage, setFormData } = props;

  const handleImageChange = useCallback(
    async (e) => {
      if (e.target.files) {
        const image: File = e.target.files[0];
        setFormData((prev) => {
          prev.set("image", image, image.name);
          return prev;
        });
        const imageUrl = URL.createObjectURL(image);
        setImage(imageUrl);
      }
    },
    [setFormData, setImage]
  );

  return (
    <>
      <button
        className="absolute btn-sm btn-circle btn-ghost right-2 top-2"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("drawer-overlay")?.click();
        }}
      >
        ✕
      </button>
      <div className="flex items-center justify-between my-6">
        <h3 className="text-lg font-bold">Profile</h3>
        {/* Edit profile button */}
        <button
          className="btn btn-xs btn-primary"
          onClick={(e) => {
            e.preventDefault();
            return setEditMode(!editMode);
          }}
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>
      <div className="flex flex-col items-center justify-center space-y-1">
        {/* Avatar */}
        <label
          htmlFor="avatar"
          className="relative w-24 h-24 overflow-hidden transition-all border-0 rounded-full shadow-md cursor-pointer select-none dark:bg-gray-600 btn-ghost avatar aspect-1 btn-circle mask hover:shadow-lg"
        >
          {/* Avatar */}
          <img
            src={
              image ||
              `https://api.dicebear.com/6.x/avataaars/svg?seed=${props.user.username}`
            }
            alt="avatar"
            className="h-full"
          />
          {/* Change avatar button */}
          <div className="absolute inset-0 flex items-center justify-center text-sm text-center text-white align-middle transition-opacity bg-black bg-opacity-50 opacity-0 hover:opacity-100">
            <span className="absolute top-0 bottom-0 w-full h-full m-auto leading-tight text-center -translate-x-1/2 translate-y-1/3 start-1/2">
              <p className="leading-[.6rem] font-bold text-[.7rem] uppercase subpixel-antialiased pt-2 select-none tracking-tight">
                Change
                <br />
                Avatar
              </p>
            </span>

            {/* File input to change avatar */}
            <input
              id="avatar"
              type="file"
              hidden
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
          </div>
        </label>

        {/* Username */}
        <h3 className="text-xl font-bold">{props.current.username}</h3>

        {/* Bio */}
        <p className="text-sm text-center">{props.current.bio}</p>
      </div>

      {/* GitHub link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between mt-4">
          <a
            href={`github.com/${props.current.github}`}
            onClick={(e) => {
              e.preventDefault();
              window.open(`https://www.github.com/${props.current.github}`);
            }}
            className="flex items-center justify-between mt-4 space-x-1"
          >
            <FaGithub />
            <span className="text-sm font-bold">Github</span>
          </a>
        </div>
      </div>
    </>
  );
}
