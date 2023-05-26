import { FC, useState } from "react";
import { Avatar } from "../common/Avatar";
import { User } from "../../features/users/types";
import { Modal } from "../common/Modal";
import { UserSearch } from "../UserSearch";
import { GroupForm } from "../GroupForm";
import SidebarTabs, { Tab } from "./SidebarTab";

interface SidebarHeaderProps {
  user: User;
  activeTab: Tab;
  onChangeTab: (tab: Tab) => void;
}
export const SidebarHeader: FC<SidebarHeaderProps> = ({
  user,
  activeTab,
  onChangeTab,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const handleGroupModalClose = () => {
    setIsGroupModalOpen(false);
  };

  return (
    <>
      <div className="w-full bg-gray-200 px-3 py-2 dark:bg-gray-800">
        <div className="flex items-center">
          <div className="h-10 w-10">
            <Avatar />
          </div>
          <div className="w-3"></div>
          <h1 className="text-center text-xl">
            Welcome, <span>{user?.username}</span>
          </h1>
        </div>
        <button
          className="max-w-md cursor-pointer rounded border-2 border-gray-300 px-3 py-1 text-left dark:border-gray-700"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Start a new chat...
        </button>

        <div
          className="cursor-pointer justify-self-end"
          onClick={() => {
            setIsGroupModalOpen(true);
          }}
        >
          <svg
            viewBox="0 0 1024 1024"
            fill="currentColor"
            className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z" />
            <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z" />
          </svg>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          handleCloseModal={() => {
            setIsModalOpen(false);
          }}
        >
          <UserSearch />
        </Modal>
      )}
      {isGroupModalOpen && (
        <Modal handleCloseModal={handleGroupModalClose}>
          <GroupForm
            handleCloseModal={() => {
              setIsGroupModalOpen(false);
            }}
          />
        </Modal>
      )}
      <div className="h-2"></div>

      <SidebarTabs activeTab={activeTab} onChangeTab={onChangeTab} />
    </>
  );
};
