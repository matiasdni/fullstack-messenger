import { lazy, Suspense, useState } from "react";
import { useAppSelector } from "../../store";
import { ChatList } from "./ChatList";
import { SidebarHeader } from "./SidebarHeader";
import { Tab } from "./SidebarTab";
import { Chat } from "features/chats/types";

const FriendList = lazy(() => import("./FriendList"));
const InviteList = lazy(() => import("./InviteList"));

function SidebarContent(props: {
  activeTab: "chats" | "friends" | "invites";
  chats: Chat[];
  fallback: JSX.Element;
}) {
  return (
    <div className="flex w-full h-full overflow-x-hidden overflow-y-auto ">
      {/* chats list */}
      {props.activeTab === "chats" && <ChatList chats={props.chats} />}
      {props.activeTab === "friends" && (
        <Suspense fallback={props.fallback}>
          <FriendList />
        </Suspense>
      )}
      {props.activeTab === "invites" && (
        <Suspense fallback={props.fallback}>
          <InviteList />
        </Suspense>
      )}
    </div>
  );
}

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
          <SidebarContent
            activeTab={activeTab}
            chats={allChats}
            fallback={loading}
          />
        </div>
      </div>
    </>
  );
};
