import { useEffect, useState } from "react";

import { DrawerProvider } from "@/contexts/DrawerContext";
import useSocketEvents from "../hooks/UseSocketEvents";
import { DrawerContent, DrawerSide, DrawerWrapper } from "./Drawer";
import { Chat } from "./chat/Chat";
import DarkModeToggle from "./common/DarkModeToggle";
import { LoadingChat } from "./common/LoadingChat";
import Sidebar from "./sidebar/Sidebar";

const container =
  "container absolute right-0 left-0 max-w-7xl text-neutral-800 dark:text-neutral-300 bg-white dark:bg-gray-900 antialiased";

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

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <DarkModeToggle />
      <div className={container}>
        <DrawerProvider>
          <DrawerWrapper>
            <DrawerContent>
              <Sidebar />
              <main className="flex-1 min-w-0 overflow-auto">
                <Chat />
              </main>
            </DrawerContent>
            <DrawerSide />
          </DrawerWrapper>
        </DrawerProvider>
      </div>
    </div>
  );
};
