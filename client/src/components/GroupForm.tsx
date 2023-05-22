import { useAppDispatch, useAppSelector } from "../store";
import React, { useCallback, useState } from "react";
import { User } from "../features/users/types";
import { ChatType, createChat } from "../features/chats/chatsSlice";
import { searchUsersByName } from "../services/user";
import AsyncSelect from "react-select/async";
import OptionTypeBase from "react-select";

export type GroupChat = {
  name: string;
  description?: string;
  users?: User[];
  chat_type: ChatType.Group;
};

interface UserOption extends OptionTypeBase {
  label: string;
  value: User;
  avatar: string;
}

const userToOption = (user: User): UserOption =>
  ({
    label: user.username,
    value: user,
  } as UserOption);

const formatOptionLabel = ({ value, label, avatar }) => (
  <div className="flex flex-row items-center">
    <img className="inline-block h-8 w-8 rounded-full" src={avatar} alt="" />
    <p className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
      {label}
    </p>
  </div>
);

interface UserSelectProps {
  selectedUsers: UserOption[];
  onUserSelect: (selected: User[]) => void;
  searchUsersByName: (
    inputValue: string,
    token: string
  ) => Promise<UserOption[]>;
  token: string;
}

const UserSelect = ({ onUserSelect, searchUsersByName, token }) => {
  const loadOptions = useCallback(
    async (inputValue): Promise<UserOption[]> => {
      if (!inputValue) {
        return [];
      }
      const users = await searchUsersByName(inputValue, token);
      return users.map(userToOption);
    },
    [searchUsersByName, token]
  );

  return (
    <AsyncSelect
      isMulti
      cacheOptions
      loadOptions={loadOptions}
      onChange={onUserSelect}
      closeMenuOnSelect={false}
      noOptionsMessage={() => null}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      formatOptionLabel={formatOptionLabel}
      styles={{
        input: (base) => ({
          ...base,
          "input:focus": {
            boxShadow: "none",
          },
        }),
      }}
    />
  );
};

const AddUsers = ({ setSelectedUsers }) => {
  const [selected, setSelected] = useState([]);
  const { token } = useAppSelector((state) => state.auth);

  const handleUserSelect = (selected) => {
    setSelected(selected);
    setSelectedUsers(selected.map((option) => option.value));
  };

  return (
    <div className="flex flex-col">
      <p className="text-sm">Add users</p>
      <UserSelect
        onUserSelect={handleUserSelect}
        searchUsersByName={searchUsersByName}
        token={token}
      />
    </div>
  );
};

export const GroupForm = (props: { handleCloseModal: () => void }) => {
  const dispatch = useAppDispatch();
  const [groupName, setGroupName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupDescription, setGroupDescription] = useState<string>("");

  const handleCreateGroup = async () => {
    console.log(selectedUsers);
    const chat: GroupChat = {
      name: groupName,
      description: groupDescription,
      users: selectedUsers,
      chat_type: ChatType.Group,
    };

    const action = await dispatch(await createChat(chat));
    if (createChat.fulfilled.match(action)) {
      console.log("Group created");
      console.log(action.payload);
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-2 p-4"
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
        placeholder="Description"
        className="rounded-md border border-gray-300 p-2 dark:border-gray-700"
        value={groupDescription}
        onChange={(e) => setGroupDescription(e.target.value)}
      />
      <div className={`relative flex-1`}>
        <AddUsers setSelectedUsers={setSelectedUsers} />
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
