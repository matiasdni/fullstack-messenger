import { useMemo, useState } from "react";
import { useAppSelector } from "../../store";
import { SidebarHeader } from "./SidebarHeader";
import { ChatList } from "./ChatList";
import { Tab } from "./SidebarTab";

const FriendList = () => {
  return <div>FriendList</div>;
};

const InviteList = () => {
  return <div>InviteList</div>;
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
      <div className="flex w-72 flex-shrink-0 overflow-hidden">
        <div className="flex h-full w-full flex-col">
          <SidebarHeader
            user={user}
            activeTab={activeTab}
            onChangeTab={handleTabChange}
          />

          <div className="flex h-full w-full overflow-y-auto overflow-x-hidden">
            {/* chats list */}
            {activeTab === "chats" && <ChatList chats={sortedChats} />}
            {activeTab === "friends" && <FriendList />}
            {activeTab === "invites" && <InviteList />}
          </div>
        </div>
      </div>
    </>
  );
};
