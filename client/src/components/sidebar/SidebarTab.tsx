import { FC, useState } from "react";

type Tab = "chats" | "friends" | "invites";

interface Props {
  activeTab: Tab;
  onChangeTab: (tab: Tab) => void;
}

const SidebarTabs: FC<Props> = ({ activeTab, onChangeTab }) => {
  const [tabs] = useState<Tab[]>(["chats", "friends", "invites"]);

  return (
    <>
      <div className="flex justify-between space-x-1 bg-neutral-100 px-1 py-2 dark:bg-gray-800/75">
        {tabs.map((tab) => (
          <div className="flex-1 shadow-sm" key={tab}>
            <button
              key={tab}
              onClick={() => onChangeTab(tab)}
              className={`${
                activeTab === tab
                  ? " bg-neutral-200 dark:bg-gray-800"
                  : "bg-neutral-100 dark:bg-gray-900/25"
              } w-full p-2 text-center shadow-inner hover:bg-gray-200 focus:bg-gray-200 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800`}
            >
              {tab}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export { SidebarTabs };
export type { Tab };
