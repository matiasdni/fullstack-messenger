import { Suspense, lazy, useState } from "react";
import { useAppSelector } from "../../store";
import { ChatList } from "./ChatList";
import { SidebarHeader } from "./SidebarHeader";
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
      <div className="flex flex-shrink-0 overflow-hidden select-none w-72 ">
        <div className="flex flex-col w-full h-full ">
          <SidebarHeader activeTab={activeTab} onChangeTab={handleTabChange} />

          <div className="flex w-full h-full overflow-x-hidden overflow-y-auto ">
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
