import { useMemo, useState } from "react";
import { useAppSelector } from "../../store";
import { SidebarHeader } from "./SidebarHeader";
import { ChatList } from "./ChatList";
import { Tab } from "./SidebarTab";
import { Invite, User } from "src/features/users/types";
import { users, invites } from "../../sampledata";

type FriendListProps = {
  friends: User[];
};

const FriendList = ({ friends }: FriendListProps) => {
  return (
    <div className="relative flex w-full flex-col space-y-6 p-2">
      {friends.map((friend) => (
        <div key={friend.id} className="relative flex items-center space-x-2">
          <img
            src={`https://avatars.dicebear.com/api/identicon/${friend.username}.svg`}
            alt="avatar"
            className="h-8 w-8 rounded-full"
          />
          <span>{friend.username}</span>
          <div className="grow"></div>
          <div className="flex space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="h-5 w-5 fill-neutral-300 hover:fill-neutral-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z" />
              </svg>
            </svg>
            {/* remove friend */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="h-5 w-5 fill-neutral-300 hover:fill-neutral-700"
            >
              <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

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
              <p className="font-semibold text-black">
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

export const Sidebar = () => {
  const allChats = useAppSelector((state) => state.chats.chats);
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<Tab>("chats");

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  const sortedChats = useMemo(
    () =>
      allChats
        .map((chat) => ({ ...chat }))
        .sort((a, b) => {
          const aLastMessage = a.messages[a.messages.length - 1];
          const bLastMessage = b.messages[b.messages.length - 1];
          if (!aLastMessage) return 1;
          if (!bLastMessage) return -1;
          return (
            new Date(bLastMessage.createdAt).getTime() -
            new Date(aLastMessage.createdAt).getTime()
          );
        }),
    [allChats]
  );

  return (
    <>
      <div className="flex w-72 flex-shrink-0 overflow-hidden ">
        <div className="flex h-full w-full flex-col">
          <SidebarHeader
            user={user}
            activeTab={activeTab}
            onChangeTab={handleTabChange}
          />

          <div className="flex h-full w-full overflow-y-auto overflow-x-hidden">
            {/* chats list */}
            {activeTab === "chats" && <ChatList chats={sortedChats} />}
            {activeTab === "friends" && <FriendList friends={users} />}
            {activeTab === "invites" && <InviteList invites={invites} />}
          </div>
        </div>
      </div>
    </>
  );
};
