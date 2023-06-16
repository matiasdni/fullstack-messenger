/* eslint-disable jsx-a11y/anchor-is-valid */
import { useDrawer } from "@/contexts/DrawerContext";
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
import { ShowDrawerBtn } from "../Drawer";
import { ChatList } from "./ChatList";
import SidebarHeader from "./SidebarHeader";
import { Tab } from "./SidebarTab";

const FriendList = lazy(() => import("./FriendList"));
const InviteList = lazy(() => import("../Drawer/InviteList"));

interface myWindow extends Window {
  openDialog: () => void;
  user_profile: HTMLDialogElement;
}

function SidebarContent(props: {
  activeTab: "chats" | "friends" | "invites" | "friend_requests";
  chats: Chat[];
  fallback: JSX.Element;
}) {
  return (
    <>
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
    </>
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
    <div className="w-[21rem] flex-none min-h-full">
      <div className="w-full h-full flex">
        <VerticalNav activeTab={activeTab} handleTabChange={handleTabChange} />

        <div className="relative w-full h-full">
          <div className="absolute inset-0 flex flex-col max-h-full">
            <SidebarHeader
              activeTab={activeTab}
              onChangeTab={handleTabChange}
            />
            <div className="overflow-y-auto">
              <SidebarContent
                activeTab={activeTab}
                chats={allChats}
                fallback={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VerticalNav = ({ handleTabChange, activeTab }) => {
  const dispatch = useAppDispatch();
  const { setDrawerContent } = useDrawer();
  const user = useAppSelector((state) => state.auth.user);

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
      <nav className="flex flex-col items-center h-full max-w-[72px]">
        <ul className="menu menu-vertical flex-1">
          <li>
            <a
              className={`tooltip tooltip-right p-0 w-12 h-12 self-center relative hover:bg-neutral-100 ${
                activeTab === "chats" &&
                "active bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300"
              }`}
              data-tip="Conversations"
              href="#"
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
              className={`tooltip tooltip-right p-0 w-12 h-12 self-center ${
                activeTab === "friends" &&
                "bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300"
              }`}
              data-tip="Friends"
              href="#"
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
              href="#"
              onClick={handleLogOut}
            >
              <div className="indicator indicator-center translate-y-1/2">
                <FiLogOut />
              </div>
            </a>
          </li>
        </ul>

        <div>
          <label
            tabIndex={0}
            className="btn-ghost avatar aspect-1 h-10 w-10 btn-circle mask shadow-md hover:shadow-lg cursor-pointer select-none"
          >
            <ShowDrawerBtn drawerContent="user">
              <img
                src={
                  user?.image
                    ? user.image
                    : `https://avatars.dicebear.com/api/identicon/${user.username}.svg`
                }
                alt={`${user.username}'s avatar`}
                className="rounded-full"
              />
            </ShowDrawerBtn>
          </label>
        </div>
      </nav>
    </IconContext.Provider>
  );
};

export default Sidebar;
