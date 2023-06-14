import { useEffect, useState } from "react";

import useSocketEvents from "../hooks/UseSocketEvents";
import { Chat } from "./chat/Chat";
import DarkModeToggle from "./common/DarkModeToggle";
import { LoadingChat } from "./common/LoadingChat";
import Sidebar from "./sidebar/Sidebar";

export const Home = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useSocketEvents();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <LoadingChat />;
  }

  const colors =
    "divide-gray-300 border border-neutral-200  dark:divide-gray-800 dark:border-gray-800";

  return (
    <div className="h-screen w-screen overflow-hidden">
      <DarkModeToggle />
      <div className="container absolute right-0 left-0 max-w-7xl text-neutral-800 dark:text-neutral-300 antialiased">
        <div className="h-[768px]">
          <div className={`flex min-h-full divide-x-[1px] shadow-md ${colors}`}>
            <Sidebar />
            <main className="flex-1 min-w-0 overflow-auto">
              <Chat />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
