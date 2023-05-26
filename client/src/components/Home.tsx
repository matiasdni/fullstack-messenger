import React, { useEffect, useState } from "react";
import { useAppSelector } from "../store";

import { Sidebar } from "./sidebar/Sidebar";
import { Chat } from "./Chat";
import DarkModeToggle from "./common/DarkModeToggle";
import { LoadingChat } from "./common/LoadingChat";
import { useSocketEvents } from "../hooks/UseSocketEvents";

export const Home = () => {
  const auth = useAppSelector((state) => state.auth);
  const chats = useAppSelector((state) => state.chats.chats);
  const [loading, setLoading] = useState<boolean>(true);

  useSocketEvents(chats, auth);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <LoadingChat />;
  }

  return (
    <div className="text-neutral-900 dark:text-neutral-300">
      <DarkModeToggle />
      <div className="container h-[768px] max-w-7xl shadow-md ">
        <div className="flex h-full shadow-inner">
          <Sidebar />
          <Chat />
        </div>
      </div>
    </div>
  );
};
