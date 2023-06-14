import { useUser } from "@/hooks/useAuth";
import { FC, useMemo, useState } from "react";

type Tab = "chats" | "friends" | "invites";

interface Props {
  activeTab: Tab;
  onChangeTab: (tab: Tab) => void;
}

const SidebarTabs: FC<Props> = ({ activeTab, onChangeTab }) => {
  const [tabs] = useState<Tab[]>(["chats", "friends", "invites"]);
  const currentUser = useUser();

  const pendingInviteCount = useMemo(() => {
    const pendingChatInvites = currentUser.chatInvites.invites.filter(
      (invite) => invite.status === "pending"
    );

    const pendingFriendRequests = currentUser.friendRequests.filter(
      (request) => request.status === "pending"
    );

    return pendingChatInvites.length + pendingFriendRequests.length;
  }, [currentUser.chatInvites.invites, currentUser.friendRequests]);

  return (
    <>
      <div className="flex justify-between px-1 py-2 space-x-1 bg-neutral-100 dark:bg-gray-800/75">
        {activeTab === "chats" && (
          <>
            <div className="tabs w-full relative">
              <a className="tab tab-bordered tab-active text-base w-1/2">
                Chats
              </a>
              <a className="tab tab-bordered text-base w-1/2">Invites</a>
            </div>
          </>
        )}
        {activeTab === "friends" && (
          <>
            <div className="tabs w-full relative">
              <a className="tab tab-bordered text-base w-1/2">Friends</a>
              <a className="tab tab-bordered tab-active text-base w-1/2 whitespace-nowrap">
                Friend Requests
              </a>
            </div>
          </>
        )}
        {/* {tabs.map((tab) => (
          <div className="flex-1 shadow-sm" key={tab}>
            <button
              key={tab}
              onClick={() => onChangeTab(tab)}
              className={`${
                activeTab === tab
                  ? " bg-neutral-200 dark:bg-gray-800"
                  : "bg-neutral-100 dark:bg-gray-900/25"
              } relative w-full p-2 text-center whitespace-nowrap shadow-inner hover:bg-gray-200 focus:bg-gray-200 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800`}
            >
              {activeTab === tab ? (
                <span className="absolute inset-x-0 bottom-0 h-1.5 bg-primary rounded-t-lg" />
              ) : (
                <span className="absolute inset-x-0 bottom-0 h-1.5 bg-transparent rounded-t-lg" />
              )}
              {tab === "invites" && pendingInviteCount > 0 && (
                <span className="inline-flex items-center justify-center px-[0.25rem] py-[0.09rem] ml-[0.4rem] text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {pendingInviteCount}
                </span>
              )}
            </button>
          </div>
        ))} */}
      </div>
    </>
  );
};

export { SidebarTabs };
export type { Tab };
