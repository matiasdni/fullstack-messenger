import { User } from "@/features/users/types";
import { useUser } from "hooks/useAuth";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../common/alert-dialog";

const FriendList = () => {
  const user = useUser();
  const [selectedUser, setSelectedUser] = useState<User>();

  const handleRemoveFriend = async (friendId: string) => {
    console.log("handleRemoveFriend", selectedUser);
  };

  return user.friends.length === 0 ? (
    <div className="flex justify-center w-full h-full">No friends yet</div>
  ) : (
    <div className="relative flex flex-col w-full p-2 space-y-6">
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              <div
                className="p-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
                onClick={() => handleRemoveFriend(user.id)}
              >
                Delete
              </div>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        {user.friends.map((friend) => (
          <div key={friend.id} className="relative flex items-center space-x-2">
            <img
              src={`https://avatars.dicebear.com/api/identicon/${friend.username}.svg`}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span>{friend.username}</span>
            <div className="grow"></div>
            <div className="flex space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-5 h-5 fill-neutral-300 hover:fill-neutral-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z" />
                </svg>
              </svg>
              {/* remove friend */}
              <AlertDialogTrigger onClick={() => setSelectedUser(friend)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-5 h-5 fill-neutral-300 hover:fill-neutral-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M448 448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V64C0 46.3 14.3 32 32 32h384c17.7 0 32 14.3 32 32v384z" />
                  </svg>
                </svg>
              </AlertDialogTrigger>
            </div>
          </div>
        ))}
      </AlertDialog>
    </div>
  );
};

export default FriendList;
