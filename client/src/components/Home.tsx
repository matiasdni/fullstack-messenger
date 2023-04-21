import React, { useEffect, useState } from "react";
import { useAppSelector } from "../store";

import { Sidebar } from "./Sidebar";
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
    <div className="flex h-screen flex-col overflow-hidden text-neutral-900 dark:text-neutral-300">
      <DarkModeToggle />
      <div className="flex-1">
        <div className="grid h-full grid-rows-1 sm:grid-cols-[1fr_5fr] md:grid-cols-auto-1fr">
          <Sidebar />
          <div className="relative overflow-hidden">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
};
