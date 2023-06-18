import { useActiveChat } from "@/hooks/useChats";
import { FC, ReactNode } from "react";
import { useDrawer } from "contexts/DrawerContext";
import ChatInfo from "../chat/ChatInfo";
import { UserProfile } from "../profile/UserProfile";
import InviteList from "./InviteList";

interface Props {
  children: ReactNode;
  drawerContent?: "chat" | "user" | "notifications";
}

const colors = "border-0 divide-x-0";
const DrawerWrapper: FC<Props> = ({ children }) => {
  return (
    <div className="drawer-end flex relative h-[768px] min-h-full max-w-screen-xl aspect-w-3 aspect-h-2 cursor-default">
      <input className="drawer-toggle" type="checkbox" id="my-drawer" />
      {children}
    </div>
  );
};

const DrawerContent: FC<Props> = ({ children }) => {
  return (
    <div
      className={`drawer-content flex-1 flex max-w-full shadow-md ${colors}`}
    >
      {/* Main content here */}
      {children}
    </div>
  );
};

const DrawerSide: FC<Partial<Props>> = ({ children }) => {
  const { drawerContent } = useDrawer();
  const activeChat = useActiveChat();

  const renderDrawerContent = () => {
    switch (drawerContent) {
      case "chat":
        return <ChatInfo activeChat={activeChat} setShowChatInfo={null} />;
      case "user":
        return <UserProfile />;
      case "notifications":
        return <InviteList />;
      default:
        return null;
    }
  };

  return (
    <div className="absolute h-full shadow-md drawer-side">
      <label
        htmlFor="my-drawer"
        className="drawer-overlay hover:cursor-default transition-all opacity-25 duration-[10s] ease-in-out"
        id="drawer-overlay"
      ></label>
      {/* Sidebar content here */}
      <div className="dark:bg-gray-800 bg-white h-full xl:w-[29%] overflow-y-auto overscroll-contain lg:w-1/3 md:w-[45%]">
        {renderDrawerContent()}
        {children}
      </div>
    </div>
  );
};

const ShowDrawerBtn: FC<Props> = ({ children, drawerContent }) => {
  const { setDrawerContent } = useDrawer();

  return (
    <label htmlFor="my-drawer" className="drawer-button">
      <div onClick={() => setDrawerContent(drawerContent)}>{children}</div>
    </label>
  );
};

export { DrawerContent, DrawerSide, DrawerWrapper, ShowDrawerBtn };
