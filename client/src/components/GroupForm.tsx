import { useAppDispatch, useAppSelector } from "../store";
import React, { FC, useEffect, useRef, useState } from "react";
import { User } from "../features/users/types";
import { ChatType, createChat } from "../features/chats/chatsSlice";
import { Combobox } from "@headlessui/react";
import { searchUsersByName } from "../services/user";
import { debounce } from "../utils/debounce";

export type GroupChat = {
  name: string;
  description?: string;
  users?: User[];
  chat_type: ChatType.Group;
};

const AddUsers: FC = () => {
  const [selected, setSelected] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [options, setOptions] = useState<User[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const token = useAppSelector((state) => state.auth.token);
  const cache = useRef<{ [key: string]: User[] }>({});

  const fetchData = () => {
    if (search) {
      if (search in cache.current) {
        console.log("cached");
        setOptions(cache.current[search]);
      } else {
        console.log("searching");
        searchUsersByName(search, token).then((res: User[]) => {
          cache.current[search] = res;
          setOptions(res);
        });
      }
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    const debouncedSearch = debounce(fetchData, 500);
    debouncedSearch();
  }, [search]);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const handleUserSelect = (user: User) => {
    setSelected((prevSelected) => [...prevSelected, user]);
  };

  const handleUserDeselect = (user: User) => {
    setSelected((prevSelected) => prevSelected.filter((u) => u.id !== user.id));
  };

  return (
    <>
      <p className="text-sm">Add users</p>
      <div className="w-full">
        <Combobox>
          <Combobox.Input
            className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-700"
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
          />
          <div className="absolute z-10 w-full rounded-md bg-white shadow-lg dark:bg-gray-800">
            <Combobox.Options>
              {options.map((user) => (
                <Combobox.Option
                  key={user.id}
                  onSelect={() => handleUserSelect(user)}
                  value={user.username}
                >
                  <div className="cursor-pointer flex-row items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="flex flex-row items-center">
                      <img
                        className="inline-block h-8 w-8 rounded-full"
                        src={`https://avatars.dicebear.com/api/identicon/${user.username}.svg`}
                        alt=""
                      />
                      <p className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {user.username}
                      </p>
                    </div>
                    {selected.find((u) => u.id === user.id) && (
                      <span className="text-green-500">Added</span>
                    )}
                  </div>
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </div>
        </Combobox>
      </div>
    </>
  );
};

export const GroupForm = (props: { handleCloseModal: () => void }) => {
  const dispatch = useAppDispatch();
  const [groupName, setGroupName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
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
      <AddUsers />

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
