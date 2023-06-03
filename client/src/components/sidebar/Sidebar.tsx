import { Suspense, lazy, useState } from "react";
import { useAppSelector } from "../../store";
import { SidebarHeader } from "./SidebarHeader";
import { ChatList } from "./ChatList";
import { Tab } from "./SidebarTab";

const FriendList = lazy(() => import("./FriendList"));
const InviteList = lazy(() => import("./InviteList"));

export const Sidebar = () => {
  const allChats = useAppSelector((state) => state.chats.chats);
  const [activeTab, setActiveTab] = useState<Tab>("chats");

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  const loading = <div>Loading...</div>;

  return (
    <>
      <div className="flex w-72 flex-shrink-0 select-none scroll-m-2 scroll-p-2 overflow-hidden ">
        <div className="flex h-full w-full scroll-m-2 scroll-p-2 flex-col">
          <SidebarHeader activeTab={activeTab} onChangeTab={handleTabChange} />

          <div className="flex h-full w-full scroll-m-2 scroll-p-2 overflow-y-auto overflow-x-hidden">
            {/* chats list */}
            {activeTab === "chats" && <ChatList chats={allChats} />}
            {activeTab === "friends" && (
              <Suspense fallback={loading}>
                <FriendList />
              </Suspense>
            )}
            {activeTab === "invites" && (
              <Suspense fallback={loading}>
                <InviteList />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
