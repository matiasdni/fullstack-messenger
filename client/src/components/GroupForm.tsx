import { useAppDispatch, useAppSelector } from "../store";
import React, { useState } from "react";
import { User } from "../features/users/types";
import { ChatType, createChat } from "../features/chats/chatsSlice";

export type GroupChat = {
  name: string;
  description?: string;
  users?: User[];
  chat_type: ChatType.Group;
};

export const GroupForm = (props: { handleCloseModal: () => void }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [groupName, setGroupName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([user]);
  const [groupDescription, setGroupDescription] = useState<string>("");

  const handleUserSelect = (user: User) => {
    setSelectedUsers((prev) => [...prev, user]);
  };

  const handleUserDeselect = (user: User) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const handleCreateGroup = async () => {
    const chat: GroupChat = {
      name: groupName,
      description: groupDescription,
      users: selectedUsers,
      chat_type: ChatType.Group,
    };

    await dispatch(createChat(chat));
    props.handleCloseModal();
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className=" flex flex-col gap-2 p-4"
    >
      <h1 className="text-xl">Create group</h1>
      <p className="text-sm">Group name</p>
      <input
        type="text"
        placeholder="Group name"
        className="rounded-md border border-gray-300 p-2 dark:border-gray-700"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />

      <p className="text-sm">Description</p>
      <input
        type="text"
        placeholder="Group name"
        className="rounded-md border border-gray-300 p-2 dark:border-gray-700"
        value={groupDescription}
        onChange={(e) => setGroupDescription(e.target.value)}
      />
      <p className="text-sm">Add users</p>
      <input
        type="text"
        placeholder="Search users"
        className="rounded-md border border-gray-300 p-2 dark:border-gray-700"
      />

      <div className="flex flex-col gap-2">
        <p className="text-sm">Selected users</p>
        <div className="flex flex-col gap-2">
          {selectedUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-row items-center justify-between rounded-md border border-gray-300 p-2 dark:border-gray-700"
            >
              <p>{user.username}</p>
              <button
                className="text-red-500"
                onClick={() => handleUserDeselect(user)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <button
          className="rounded-md bg-blue-600 p-2 text-white"
          onClick={handleCreateGroup}
        >
          Create
        </button>
        <button
          className="rounded-md bg-red-500 p-2 text-white"
          onClick={props.handleCloseModal}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
