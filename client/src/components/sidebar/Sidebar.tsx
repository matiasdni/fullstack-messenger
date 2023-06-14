import { logOut } from "@/features/auth/authSlice";
import { setNotification } from "@/features/notification/notificationSlice";
import { useAppDispatch } from "@/store";
import { Chat } from "features/chats/types";
import { lazy, Suspense, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { IconContext } from "react-icons/lib";
import { useAppSelector } from "../../store";
import { ChatList } from "./ChatList";
import SidebarHeader from "./SidebarHeader";
import { Tab } from "./SidebarTab";

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

const Sidebar = () => {
  const allChats = useAppSelector((state) => state.chats.chats);
  const [activeTab, setActiveTab] = useState<Tab>("chats");

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  const loading = <div>Loading...</div>;

  return (
    <div className="basis-1/5 flex flex-nowrap">
      <VerticalNav activeTab={activeTab} handleTabChange={handleTabChange} />
      <div className="grow-0">
        <SidebarHeader activeTab={activeTab} onChangeTab={handleTabChange} />
        <SidebarContent
          activeTab={activeTab}
          chats={allChats}
          fallback={loading}
        />
      </div>
    </div>
  );
};

const VerticalNav = ({ handleTabChange, activeTab }) => {
  const dispatch = useAppDispatch();

  const handleLogOut = () => {
    dispatch(logOut());
    dispatch(
      setNotification({ message: "Logged out successfully", status: "success" })
    );
  };

  return (
    <IconContext.Provider
      value={{
        className:
          "text-neutral-500 dark:text-neutral-400 inline-block text-2xl align-middle place-self-center",
      }}
    >
      <ul className="menu m-0 px-0 z-[100] w-16 space-y-2 rounded-box menu-vertical">
        <li>
          <a
            className={`tooltip tooltip-right p-0 w-12 h-12 self-center relative hover:bg-neutral-100 ${
              activeTab === "chats" &&
              "active bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
            data-tip="Conversations"
            onClick={() => handleTabChange("chats")}
          >
            <div className="indicator indicator-center translate-y-1/2">
              <HiOutlineChatBubbleLeftRight />
              <span className="indicator-item badge badge-sm badge-ghost dark:bg-neutral-700 bg-neutral-200 text-neutral-900 dark:text-neutral-300 dark:border-0">
                5
              </span>
            </div>
          </a>
        </li>
        <li>
          <a
            className={`tooltip tooltip-right p-0 w-12 h-12 self-center  ${
              activeTab === "friends" &&
              "active bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
            data-tip="Friends"
            onClick={() => handleTabChange("friends")}
          >
            <div className="indicator indicator-center translate-y-1/2">
              <FaUserFriends />
            </div>
          </a>
        </li>
        <li>
          <a
            className="tooltip tooltip-right p-0 w-12 h-12 self-center"
            data-tip="Log out"
            onClick={handleLogOut}
          >
            <div className="indicator indicator-center translate-y-1/2">
              <FiLogOut />
            </div>
          </a>
        </li>
      </ul>
    </IconContext.Provider>
  );
};

export default Sidebar;
