import { useMemo } from "react";
import { useAppSelector } from "../../store";
import { SidebarHeader } from "./SidebarHeader";
import { ChatList } from "./ChatList";

export const Sidebar = () => {
  const allChats = useAppSelector((state) => state.chats.chats);
  const { user } = useAppSelector((state) => state.auth);

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
      <div className="flex">
        <div className="flex h-full w-full flex-col">
          <SidebarHeader user={user} />

          <div className="flex h-full w-full overflow-auto">
            {/* chats list */}
            <ChatList chats={sortedChats} />
          </div>
        </div>
      </div>
    </>
  );
};
