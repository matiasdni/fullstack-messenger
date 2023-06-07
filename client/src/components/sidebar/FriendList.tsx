import { User } from "@/features/users/types";
import { removeFriend } from "@/services/user";
import { useAuth } from "hooks/useAuth";
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
  const { user, token } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User>();

  const handleRemoveFriend = async (friendId: string) => {
    console.log("handleRemoveFriend", friendId);
    const data = await removeFriend(user.id, friendId, token);
    console.log("data", data);
  };

  return user.friends.length === 0 ? (
    <div className="flex justify-center w-full h-full">No friends yet</div>
  ) : (
    <div className="relative flex flex-col w-full p-2 space-y-6">
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove friend?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold">{selectedUser?.username}</span>{" "}
              from your friends?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="p-2 text-white rounded-md bg-neutral-500 hover:bg-neutral-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600">
              <div
                className=""
                onClick={() => handleRemoveFriend(selectedUser.id)}
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
                  <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
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
