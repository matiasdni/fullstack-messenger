import { useAppDispatch, useAppSelector } from "../store";
import React, { useEffect, useRef, useState } from "react";
import { User } from "../features/users/types";
import { ChatType, createChat } from "../features/chats/chatsSlice";
import { searchUsersByName } from "../services/user";

export type GroupChat = {
  name: string;
  description?: string;
  users?: User[];
  chat_type: ChatType.Group;
};

const AddUsers = () => {
  const [search, setSearch] = useState<string>("");
  const [options, setOptions] = useState<User[]>([]);
  const [displayOptions, setDisplayOptions] = useState<boolean>(false);
  const token = useAppSelector((state) => state.auth.token);
  const cache = useRef<{ [key: string]: User[] }>({});

  const debounce = (func: () => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func();
      }, delay);
    };
  };

  useEffect(() => {
    const debouncedSearch = debounce(() => {
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
    }, 500);

    debouncedSearch();
  }, [search]);

  const handleUserSelect = (user: User) => {};

  return (
    <>
      <p className="text-sm">Add users</p>
      <input
        type="text"
        placeholder="Search users"
        className="rounded-md border border-gray-300 p-2 dark:border-gray-700"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onBlur={() => {
          setDisplayOptions(false);
        }}
        onFocus={() => {
          setDisplayOptions(true);
        }}
      />
      <div className="relative">
        <div className="absolute z-10 w-full rounded-md bg-white shadow-lg dark:bg-gray-800">
          {displayOptions &&
            options.map((user) => (
              <div
                key={user.id}
                className="flex cursor-pointer flex-row items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  setDisplayOptions(false);
                }}
              >
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
                <button
                  className="rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                  onClick={() => {
                    setDisplayOptions(false);
                    handleUserSelect(user);
                  }}
                >
                  Add
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export const GroupForm = (props: { handleCloseModal: () => void }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
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
