import { Chat } from "@/features/chats/types";
import { User } from "@/features/users/types";
import { createContext, FC, ReactNode, useContext, useState } from "react";

export type DrawerContent = "chat" | "user" | "notifications" | null;

interface DrawerContextProps {
  drawerContent: DrawerContent;
  setDrawerContent: (content: DrawerContent) => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
}

interface DrawerProviderProps {
  children: ReactNode;
}

const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

export const DrawerProvider: FC<DrawerProviderProps> = ({ children }) => {
  const [drawerContent, setDrawerContent] = useState<DrawerContent>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  return (
    <DrawerContext.Provider
      value={{
        drawerContent,
        setDrawerContent,
        selectedUser,
        setSelectedUser,
        selectedChat,
        setSelectedChat,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => useContext(DrawerContext);
