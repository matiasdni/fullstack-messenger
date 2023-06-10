import { Chat } from "@/features/chats/types";
import { useToken } from "@/hooks/useAuth";
import { removeUserFromChat } from "@/services/chats";
import { Avatar } from "../common/Avatar";
import UserTable from "./UserTable";

interface ChatInfoProps {
  activeChat: Chat;
  setShowChatInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatInfo = ({ activeChat, setShowChatInfo }: ChatInfoProps) => {
  const locale = navigator.language;

  const token = useToken();
  const handleKick = async (id: string) => {
    console.log(id);
    const response = await removeUserFromChat({
      chatId: activeChat.id,
      token,
      userId: id,
    });
    console.log(response);
  };
  const localeDate = new Date(activeChat.createdAt).toLocaleString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const avatarStack = (
    <div className="flex -space-x-2 overflow-hidden">
      {activeChat.users.slice(0, 3).map((user) => (
        <div key={user.id}>
          <img
            className={
              "inline-block w-8 h-8 rounded-full ring-2 ring-white bg-current dark:bg-gray-400 dark:ring-gray-800"
            }
            src={`https://avatars.dicebear.com/api/identicon/${user.username}.svg`}
            alt=""
          />
        </div>
      ))}
      <div
        className={`flex items-center justify-center rounded-full ring-2 ring-white ${
          activeChat?.users?.length - 3 > 0 ? "visible" : "hidden"
        }`}
      >
        <div className="badge badge-sm badge-neutral h-8 w-8 rounded-full prose prose-emerald">
          <p className="text-base before:content-['+'] font-semibold">
            {activeChat?.users?.length - 3}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-md py-6 px-4">
        <div className=" space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chat Info</h2>
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
          <div className="flex items-center">
            <figure className="relative w-16 h-16 shrink-0">
              <Avatar />
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-out bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100">
                <button className="p-1 rounded-full bg-gray-50 dark:bg-gray-900">
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
                </button>
              </div>
            </figure>
            <div className="flex items-center justify-center w-full">
              <div className="ml-4 basis-3/4">
                <h3>{activeChat?.name}</h3>
                <p className="text-xs text-gray-500 break-inside-avoid">
                  {activeChat?.description}
                </p>
              </div>
              <div className="relative grow"></div>
              {avatarStack}
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
          <h1 className="font-semibold text-gray-500">Participants</h1>
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
