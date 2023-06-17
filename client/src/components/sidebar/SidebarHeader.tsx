import { useDrawer } from "@/contexts/DrawerContext";
import Tooltip from "components/common/Tooltip";
import { FC, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { IconContext } from "react-icons/lib";
import { MdGroupAdd, MdOutlineMessage } from "react-icons/md";
import { Tab } from "./SidebarTab";
import { Modal } from "components/common/Modal";
import { UserSearch } from "components/UserSearch";
import { GroupForm } from "components/GroupForm";

interface SidebarHeaderProps {
  activeTab: Tab;
  onChangeTab: (tab: Tab) => void;
}

const SidebarHeader: FC<SidebarHeaderProps> = ({ activeTab, onChangeTab }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState<boolean>(false);
  const { setDrawerContent } = useDrawer();

  const handleGroupModalClose = (): void => {
    setIsGroupModalOpen(false);
  };

  const setDrawerContext = (): void => setDrawerContent("notifications");

  return (
    <>
      <header className="p-2 space-y-4 bg-neutral-100 dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between mx-1 my-2">
          {/* Tab title */}
          <h2 className="w-full text-xl font-semibold text-gray-900 capitalize dark:text-gray-50">
            {activeTab}
          </h2>

          {/* action buttons */}
          <div className="space-x-2 join join-horizontal">
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
        <div className="pb-1">
          <input
            className="min-w-full p-1 space-y-0 text-left border border-gray-400 rounded shadow-sm form-input bg-neutral-100 dark:border-gray-600 dark:bg-gray-700"
            placeholder="Search for users"
          />
        </div>
      </header>

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
    </>
  );
};

export default SidebarHeader;
