import { updateChat } from "@/features/chats/chatsSlice";
import { Chat } from "@/features/chats/types";
import { useToken } from "@/hooks/useAuth";
import { removeUserFromChat, updateChatInfo } from "@/services/chats";
import { useAppDispatch } from "@/store";
import { FC, useCallback, useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { Avatar } from "../common/Avatar";
import AvatarStack from "./AvatarStack";
import EditChatForm from "./EditChatForm";
import UserTable from "./UserTable";

interface ChatInfoProps {
  activeChat: Chat;
  setShowChatInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatInfo: FC<ChatInfoProps> = ({ activeChat, setShowChatInfo }) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [chatName, setChatName] = useState<string>(activeChat.name);
  const [username, setUsername] = useState<string>("");
  const [image, setImage] = useState<string>(activeChat.image);
  const [chatDescription, setChatDescription] = useState<string>(
    activeChat.description
  );
  const [formData, setFormData] = useState<FormData>(new FormData());
  const dispatch = useAppDispatch();
  const locale = navigator.language;

  const token = useToken();

  useEffect(() => {
    setChatName(activeChat.name);
    setChatDescription(activeChat.description);
    setImage(activeChat.image);
    console.log(activeChat);
  }, [editMode]);

  const handleKick = useCallback(
    async (id: string) => {
      try {
        const response = await removeUserFromChat(activeChat.id, id);
      } catch (error) {
        console.error(error);
        // notify error
      }
    },
    [activeChat.id, token]
  );

  const handleSave = useCallback(async () => {
    try {
      setFormData((prev) => {
        prev.set("name", chatName);
        prev.set("description", chatDescription);
        return prev;
      });

      const responseData = await updateChatInfo(activeChat.id, formData);
      dispatch(updateChat(responseData));
      setEditMode(false);
    } catch (error) {
      console.error(error);
      // notify error
    }
  }, [activeChat.id, chatName, chatDescription, formData, token, dispatch]);

  const handleImageChange = useCallback(async (e) => {
    if (e.target.files) {
      const image: File = e.target.files[0];
      setFormData((prev) => {
        prev.set("image", image, image.name);
        return prev;
      });
      const imageUrl = URL.createObjectURL(image);
      setImage(imageUrl);
    }
  }, []);

  const localeDate = new Date(activeChat.createdAt).toLocaleString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-5/6 bg-white dark:bg-gray-800 rounded-md py-6 px-4">
        <div className=" space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold select-none">Chat Info </h2>
              <span
                className="inline-block cursor-pointer hover:text-black/50"
                onClick={() => setEditMode(!editMode)}
              >
                <MdOutlineEdit size={20} />
              </span>
            </div>

            <button
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              onClick={() => setShowChatInfo(false)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <figure className="w-20 h-20 shrink-0 relative m-auto">
            {image ? (
              <img className="w-full h-full rounded-full" src={image} alt="" />
            ) : (
              <Avatar />
            )}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-out bg-black bg-opacity-50 rounded-full opacity-0  ${
                editMode ? "hover:opacity-100 cursor-pointer" : null
              }`}
            >
              <button className="p-1 rounded-full bg-gray-50 dark:bg-gray-900 cursor-default">
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                {editMode && (
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                )}
              </button>
            </div>
          </figure>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-full">
              <div className="w-full">
                {editMode ? (
                  <>
                    <EditChatForm
                      chatName={chatName}
                      chatDescription={chatDescription}
                      setChatName={setChatName}
                      setChatDescription={setChatDescription}
                      handleSave={handleSave}
                    />
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold prose text-lg ">
                      {activeChat?.name}
                    </h3>
                    <p className="text-xs text-gray-500 break-inside-avoid">
                      {activeChat?.description}
                    </p>
                  </>
                )}
              </div>
              <div className="relative grow"></div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Created</p>
            <p className="text-sm text-gray-500">{localeDate}</p>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Members</p>
            <p className="text-sm text-gray-500">{activeChat?.users?.length}</p>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Messages</p>
            <p className="text-sm text-gray-500">
              {activeChat?.messages?.length}
            </p>
          </div>
          <h1 className="font-semibold flex justify-between items-center w-full text-gray-500">
            Participants{" "}
            <span className="inline-block">
              <AvatarStack users={activeChat?.users} />
            </span>
          </h1>
          {editMode ? (
            <>
              <label className="label prose-h3:prose font-semibold">
                <h3 className="label-text">Invite Your Friends!</h3>
              </label>
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  className="input input-bordered input-sm w-full max-w-sm "
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <button
                  className="btn btn-sm btn-ghost"
                  //   onClick={handleInvite}
                >
                  Invite
                </button>
              </div>
            </>
          ) : null}
          <UserTable
            users={activeChat?.users}
            handleUserRemoval={handleKick}
            chat={activeChat}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
