import { logOut } from "@/features/auth/authSlice";
import { setNotification } from "@/features/notification/notificationSlice";
import { useAppDispatch } from "@/store";
import { Tooltip } from "components/common/Tooltip";
import { UserProfile } from "components/profile/UserProfile";
import { useUser } from "hooks/useAuth";
import { FC, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { IconContext } from "react-icons/lib";
import { MdGroupAdd, MdOutlineMessage } from "react-icons/md";
import { GroupForm } from "../GroupForm";
import { UserSearch } from "../UserSearch";
import { Modal } from "../common/Modal";
import { SidebarTabs, Tab } from "./SidebarTab";

interface SidebarHeaderProps {
  activeTab: Tab;
  onChangeTab: (tab: Tab) => void;
}

interface myWindow extends Window {
  openDialog: () => void;
  user_profile: HTMLDialogElement;
}

const DropdownMenu = () => {
  const dispatch = useAppDispatch();

  const handleLogOut = () => {
    dispatch(logOut());
    // todo: when notifications are implemented display success message
    dispatch(
      setNotification({ message: "Logged out successfully", status: "success" })
    );
  };

  return (
    <>
      <ul
        tabIndex={0}
        className="p-2 shadow menu menu-xs dropdown-content bg-base-100 rounded-box w-28"
      >
        <li
          onClick={() => {
            const user_profile = (window as unknown as myWindow).user_profile;
            user_profile.showModal();
          }}
        >
          <a>Profile</a>
        </li>
        <li className="dropdown" onClick={handleLogOut}>
          <a>Logout</a>
        </li>
      </ul>
    </>
  );
};

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
    <>
      <UserProfile />

      <div className="flex flex-col items-center px-3 py-2 space-y-2 bg-neutral-100 dark:bg-gray-800">
        <div className="flex items-center space-x-3 w-full">
          <div className="dropdown z-50">
            <label
              tabIndex={0}
              className="btn-ghost avatar aspect-1 h-10 w-10 btn-circle mask mask-squircle"
            >
              <div className="avatar h-9 w-9 aspect-1">
                <div className=" aspect-1 rounded-full">
                  <img
                    src={
                      user?.image
                        ? user.image
                        : `https://avatars.dicebear.com/api/identicon/${user.username}.svg`
                    }
                    alt={`${user.username}'s avatar`}
                  />
                </div>
              </div>
            </label>
            <DropdownMenu />
          </div>
          <div className="flex-1"></div>
          <IconContext.Provider
            value={{
              className:
                "text-gray-500 dark:text-gray-400 h-6 w-6 hover:text-gray-900 dark:hover:text-gray-50 cursor-pointer align-middle transition-colors duration-200 ease-in-out",
            }}
          >
            <span className="p-2 flex items-center w-full space-x-4 justify-end z-[200]">
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
        <input
          className="min-w-full px-3 py-1 text-left border border-gray-400 rounded shadow-sm bg-neutral-100 dark:border-gray-600 dark:bg-gray-700"
          placeholder="Search for users"
        />
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

export default SidebarHeader;
