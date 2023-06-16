import { useActiveChat } from "@/hooks/useChats";
import { FC } from "react";
import { useDrawer } from "../../contexts/DrawerContext";
import ChatInfo from "../chat/ChatInfo";
import "./Drawer.css";
import InviteList from "./InviteList";

interface Props {
  children: React.ReactNode;
}

const colors = "border-0 divide-x-0";
const DrawerWrapper: FC<Props> = ({ children }) => {
  return (
    <div className="drawer-end flex relative h-[768px] min-h-full max-w-screen-xl cursor-default">
      <input className="drawer-toggle" type="checkbox" id="my-drawer" />
      {children}
    </div>
  );
};

const DrawerContent: FC<Props> = ({ children }) => {
  return (
    <div className={`drawer-content flex-1 flex shadow-md ${colors}`}>
      {/* Main content here */}
      {children}
    </div>
  );
};

const DrawerSide: FC = () => {
  const { drawerContent } = useDrawer();
  const activeChat = useActiveChat();

  const renderDrawerContent = () => {
    switch (drawerContent) {
      case "chat":
        return <ChatInfo activeChat={activeChat} setShowChatInfo={null} />;
      case "user":
        return "userr";
      case "notifications":
        return <InviteList />;
      default:
        return null;
    }
  };

  return (
    <div className="drawer-side absolute h-full shadow-md">
      <label
        htmlFor="my-drawer"
        className="drawer-overlay hover:cursor-default"
      ></label>
      {/* Sidebar content here */}
      <div className="bg-teal-100 h-full w-[29%] overscroll-contain">
        {renderDrawerContent()}
      </div>
    </div>
  );
};

const ShowDrawerBtn: FC<Props> = ({ children }) => {
  return (
    <label htmlFor="my-drawer" className="drawer-button">
      {children}
    </label>
  );
};

export { DrawerContent, DrawerSide, DrawerWrapper, ShowDrawerBtn };
