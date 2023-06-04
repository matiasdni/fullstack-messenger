import { useUser } from "hooks/useAuth";
import { FC, useState } from "react";
import { GroupForm } from "../GroupForm";
import { UserSearch } from "../UserSearch";
import { Avatar } from "../common/Avatar";
import { Modal } from "../common/Modal";
import { SidebarTabs, Tab } from "./SidebarTab";

interface SidebarHeaderProps {
  activeTab: Tab;
  onChangeTab: (tab: Tab) => void;
}
export const SidebarHeader: FC<SidebarHeaderProps> = ({
  activeTab,
  onChangeTab,
}: SidebarHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState<boolean>(false);
  const user = useUser();

  const handleGroupModalClose = (): void => {
    setIsGroupModalOpen(false);
  };

  return (
    <>
      <div className="space-y-2 bg-neutral-100 px-3 py-2 dark:bg-gray-800">
        <div className="mx-auto flex items-center space-x-3 text-xl">
          <div className="h-10 w-10">
            <Avatar />
          </div>
          <h1>
            Welcome, <span>{user?.username}</span>
          </h1>
          <div className="flex-1"></div>
          <span
            className="cursor-pointer p-2"
            onClick={(): void => {
              setIsGroupModalOpen(true);
            }}
          >
            <svg
              viewBox="0 0 1024 1024"
              className="h-6 w-6 fill-current hover:fill-gray-700 dark:fill-gray-400 dark:hover:fill-gray-300"
            >
              <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z" />
              <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z" />
            </svg>
          </span>
        </div>
        <button
          className="min-w-full cursor-pointer rounded border border-gray-400 bg-neutral-100 px-3 py-1 text-left shadow-sm dark:border-gray-600 dark:bg-gray-700"
          onClick={(): void => {
            setIsModalOpen(true);
          }}
        >
          Start a new chat...
        </button>
      </div>

      {isModalOpen && (
        <Modal
          handleCloseModal={(): void => {
            setIsModalOpen(false);
          }}
        >
          <UserSearch />
        </Modal>
      )}
      {isGroupModalOpen && (
        <Modal handleCloseModal={handleGroupModalClose}>
          <GroupForm
            handleCloseModal={(): void => {
              setIsGroupModalOpen(false);
            }}
          />
        </Modal>
      )}

      <SidebarTabs activeTab={activeTab} onChangeTab={onChangeTab} />
    </>
  );
};
