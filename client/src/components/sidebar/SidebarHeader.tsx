import { useDrawer } from "@/contexts/DrawerContext";
import Tooltip from "components/common/Tooltip";
import { useUser } from "hooks/useAuth";
import { FC, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { IconContext } from "react-icons/lib";
import { MdGroupAdd, MdOutlineMessage } from "react-icons/md";
import { GroupForm } from "../GroupForm";
import { UserSearch } from "../UserSearch";
import { Modal } from "../common/Modal";
import { Tab } from "./SidebarTab";

interface SidebarHeaderProps {
  activeTab: Tab;
  onChangeTab: (tab: Tab) => void;
}

const SidebarHeader: FC<SidebarHeaderProps> = ({
  activeTab,
  onChangeTab,
}: SidebarHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState<boolean>(false);
  const user = useUser();
  const { setDrawerContent } = useDrawer();

  const handleGroupModalClose = (): void => {
    setIsGroupModalOpen(false);
  };

  const setDrawerContext = (): void => setDrawerContent("notifications");

  return (
    <div className="px-3 py-2 space-y-2 bg-neutral-100 dark:bg-gray-800">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        {/* Tab title */}
        <h2 className="text-lg capitalize font-semibold text-gray-900 dark:text-gray-50 m-2">
          {activeTab}
        </h2>

        {/* action buttons */}
        <div className="join join-horizontal space-x-2">
          <IconContext.Provider
            value={{
              className:
                "text-gray-500 join-item dark:text-gray-400 h-6 w-6 hover:text-gray-900 dark:hover:text-gray-50 cursor-pointer align-middle transition-colors duration-200 ease-in-out",
            }}
          >
            {/* Start a chat icon */}
            <Tooltip label="Start a Chat">
              <MdOutlineMessage
                onClick={(): void => {
                  setIsModalOpen(true);
                }}
              />
            </Tooltip>

            {/* Create group icon */}
            <Tooltip label="Create Group">
              <MdGroupAdd
                onClick={(): void => {
                  setIsGroupModalOpen(true);
                }}
              />
            </Tooltip>

            {/* Notifications icon */}
            <Tooltip label="Notifications">
              <label htmlFor="my-drawer" className="drawer-button">
                <IoIosNotifications onClick={setDrawerContext} />
              </label>
            </Tooltip>
          </IconContext.Provider>
        </div>
      </div>

      {/* Search input */}
      <input
        className="min-w-full px-3 py-1 text-left border border-gray-400 rounded shadow-sm bg-neutral-100 dark:border-gray-600 dark:bg-gray-700"
        placeholder="Search for users"
      />

      {/*
        TODO: Refactor this to parent container where the main content is
       */}
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
    </div>
  );
};

export default SidebarHeader;
