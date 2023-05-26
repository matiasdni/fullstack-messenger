import React, { useState } from "react";

export type Tab = "chats" | "friends" | "invites";

interface Props {
  activeTab: Tab;
  onChangeTab: (tab: Tab) => void;
}

export const SidebarTabs: React.FC<Props> = ({ activeTab, onChangeTab }) => {
  const [tabs] = useState<Tab[]>(["chats", "friends", "invites"]);

  return (
    <>
      <div className="flex justify-between">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onChangeTab(tab)}
            className={`${
              activeTab === tab
                ? " bg-gray-200 dark:bg-gray-800"
                : "bg-gray-100 dark:bg-gray-700"
            } w-full p-3 text-center hover:bg-gray-200 focus:bg-gray-200 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800`}
          >
            {tab}
          </button>
        ))}
      </div>
    </>
  );
};

export default SidebarTabs;
