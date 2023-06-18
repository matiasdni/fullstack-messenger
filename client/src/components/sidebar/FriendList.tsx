import { updateUser } from "@/features/auth/authSlice";
import { User } from "@/features/users/types";
import { removeFriend } from "services/userService";
import { useAppDispatch } from "@/store";
import { useAuth } from "hooks/useAuth";
import { useState } from "react";
import { createPortal } from "react-dom";
import { MdMoreVert } from "react-icons/md";
import { useDrawer } from "contexts/DrawerContext";
import { ShowDrawerBtn } from "components/Drawer";
import { setActiveChatToUser } from "features/chats/chatsSlice";

const RemoveFriendModal = ({ user, handleRemoveFriend }) => {
  return (
    <>
      <dialog
        id="friendRemove_modal"
        className="modal bg-gray-900/25 dark:bg-black/25"
      >
        <form
          method="dialog"
          className="modal-box prose prose-h3:mt-0 max-w-prose bg-base-200 dark:bg-gray-800 dark:prose-invert"
        >
          <button className="btn-sm hover:bg-transparent absolute right-2 top-2">
            ✕
          </button>
          <h3>Remove friend?</h3>
          <p className="">
            Are you sure you want to remove{" "}
            <span className="font-semibold">{user?.username}</span> from your
            friends?
          </p>
          <div className="modal-action">
            <button className="btn btn-neutral normal-case text-base">
              Cancel
            </button>
            <button
              className="btn border-0 text-neutral-content bg-red-500 rounded-md hover:bg-red-600 text-base normal-case"
              onClick={() => handleRemoveFriend(user.id)}
            >
              Delete
            </button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button className="cursor-default">close</button>
        </form>
      </dialog>
    </>
  );
};

const FriendCard = ({ friend, setSelectedUser, selectedUser }) => {
  const dispatch = useAppDispatch();
  const drawer = useDrawer();
  const handleUserClick = () => {
    // dispatch(updateUser(friend));
  };

  return (
    <li
      className="flex items-center space-x-2 p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
      onClick={async () => {
        // set active chat to friend
        dispatch(setActiveChatToUser(friend.id));
      }}
    >
      {friend.image ? (
        <img
          src={
            friend.image
              ? friend.image
              : `https://api.dicebear.com/6.x/avataaars/svg?seed=${friend.username}`
          }
          alt="user"
          className="w-8 h-8 rounded-full"
        />
      ) : (
        <img
          src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${friend.username}`}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
      )}
      <span className="truncate">{friend.username}</span>
      <div className="grow"></div>
      <div className="flex space-x-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-5 h-5 fill-neutral-300 hover:fill-neutral-700"
          onClick={handleUserClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z" />
          </svg>
        </svg>
        {/* remove friend */}
        <div className="dropdown dropdown-left">
          <MdMoreVert
            className="w-5 h-5 fill-neutral-300 hover:fill-neutral-700"
            tabIndex={0}
            onClick={() => {
              setSelectedUser(friend);
            }}
          />
          <ul
            tabIndex={0}
            className="dropdown-content menu-xs menu p-2 shadow bg-base-100 rounded-box"
          >
            {/*  Open selected user profile */}
            <li>
              <ShowDrawerBtn drawerContent={"user"}>
                <a
                  onClick={() => {
                    setSelectedUser(friend);
                    drawer.setDrawerContent("user");
                    drawer.setSelectedUser(friend);
                  }}
                >
                  View profile
                </a>
              </ShowDrawerBtn>
            </li>
            <li>
              <a
                onClick={() => {
                  setSelectedUser(friend);
                  const modal = document.getElementById(
                    "friendRemove_modal"
                  ) as HTMLDialogElement;
                  modal.show();
                }}
              >
                Remove friend
              </a>
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
};

const FriendList = () => {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User>();
  const dispatch = useAppDispatch();

  const handleRemoveFriend = async (friendId: string) => {
    const data = await removeFriend(user.id, friendId);
    if (data) {
      dispatch(updateUser(data));
    }
  };

  return user.friends.length === 0 ? (
    <div className="flex justify-center w-full h-full">No friends yet</div>
  ) : (
    <>
      {createPortal(
        <RemoveFriendModal
          user={selectedUser}
          handleRemoveFriend={handleRemoveFriend}
        />,
        document.getElementById("modal")
      )}
      <ul className="absolute inset-0">
        {user.friends.map((friend) => (
          <FriendCard
            key={friend.id}
            friend={friend}
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        ))}
      </ul>
    </>
  );
};

export default FriendList;
