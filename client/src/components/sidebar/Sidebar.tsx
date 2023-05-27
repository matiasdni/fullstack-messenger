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
import { users, invites } from "../../sampledata";
import { Invite, User } from "../../features/users/types";
import { fetchUserChatRequests, fetchUserFriends } from "src/services/user";

const FriendList = lazy(() => import("./FriendList"));
const InviteList = lazy(() => import("./InviteList"));

export const Sidebar = () => {
  const allChats = useAppSelector((state) => state.chats.chats);
  const { user, token } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<Invite[]>([]);

  useEffect(() => {
    console.log("fetching friends");
    startTransition(() => {
      fetchUserFriends(user.id, token).then((data) => {
        console.log("friends", data);

        setFriends(data);
      });
    });
  }, [user.id, token]);

  useEffect(() => {
    console.log("fetching requests");

    startTransition(() => {
      fetchUserChatRequests(user.id, token).then((data) => {
        console.log("requests", data);
        setRequests(data);
      });
    });
  }, [user.id, token]);

  const handleTabChange = (tab: Tab) => {
    startTransition(() => {
      setActiveTab(tab);
    });
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
          <SidebarHeader
            user={user}
            activeTab={activeTab}
            onChangeTab={handleTabChange}
          />

          <div className="flex h-full w-full overflow-y-auto overflow-x-hidden">
            {/* chats list */}
            {activeTab === "chats" && <ChatList chats={sortedChats} />}
            <Suspense fallback={loading}>
              {activeTab === "friends" && <FriendList friends={users} />}
              {activeTab === "invites" && <InviteList invites={invites} />}
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};
