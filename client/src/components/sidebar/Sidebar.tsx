import {
  Suspense,
  lazy,
  startTransition,
  useEffect,
  useMemo,
  useState,
} from "react";
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

  const loading = <div>Loading...</div>;

  return (
    <>
      <div className="flex w-72 flex-shrink-0 overflow-hidden ">
        <div className="flex h-full w-full flex-col">
          <SidebarHeader activeTab={activeTab} onChangeTab={handleTabChange} />

          <div className="flex h-full w-full overflow-y-auto overflow-x-hidden">
            {/* chats list */}
            {activeTab === "chats" && <ChatList chats={sortedChats} />}
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
