import { Tooltip } from "components/common/Tooltip";
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
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState<boolean>(false);
  const user = useUser();

  const handleGroupModalClose = (): void => {
    setIsGroupModalOpen(false);
  };

  const openNotificationsPanel = (): void => setIsNotificationsOpen(true);

  return (
    <div className="px-3 py-2 space-y-2 bg-neutral-100 dark:bg-gray-800">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-lg normal-case font-semibold text-gray-900 dark:text-gray-50">
          {activeTab}
        </h2>

        <div className="flex space-x-2">
          <IconContext.Provider
            value={{
              className:
                "text-gray-500 dark:text-gray-400 h-6 w-6 hover:text-gray-900 dark:hover:text-gray-50 cursor-pointer align-middle transition-colors duration-200 ease-in-out",
            }}
          >
            <span className="inline-flex items-center space-x-4 z-[200]">
              <Tooltip label="Start a Chat">
                <MdOutlineMessage
                  onClick={(): void => {
                    setIsModalOpen(true);
                  }}
                />
              </Tooltip>

              <Tooltip label="Create Group">
                <MdGroupAdd
                  onClick={(): void => {
                    setIsGroupModalOpen(true);
                  }}
                />
              </Tooltip>
              <div className="dropdown">
                <label
                  tabIndex={0}
                  className="btn p-0 bg-transparent hover:bg-transparent border-none "
                >
                  <IoIosNotifications onClick={openNotificationsPanel} />
                </label>
                <ul className="p-2 shadow absolute menu-vertical dropdown-content bg-base-100 rounded-box w-52">
                  <li>
                    <a>Item 1</a>
                  </li>
                  <li>
                    <a>Item 2</a>
                  </li>
                </ul>
              </div>
            </span>
          </IconContext.Provider>
        </div>
      </div>

      <input
        className="min-w-full px-3 py-1 text-left border border-gray-400 rounded shadow-sm bg-neutral-100 dark:border-gray-600 dark:bg-gray-700"
        placeholder="Search for users"
      />

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
