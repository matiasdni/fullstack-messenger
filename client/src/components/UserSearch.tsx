import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { ChatType, createChat } from "../features/chats/chatsSlice";
import { searchUsersByName } from "../services/user";

const StatusIndicator = ({ online }) => {
  return (
    <>
      {online ? (
        <div className="flex flex-row items-center">
          <div className="flex h-2 w-2 items-center justify-center rounded-full bg-green-400" />
          <p className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-300">
            Online
          </p>
        </div>
      ) : (
        <div className="flex flex-row items-center">
          <div className="flex h-2 w-2 items-center justify-center rounded-full bg-red-400" />
          <p className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-300">
            Offline
          </p>
        </div>
      )}
    </>
  );
};

export const UserSearch = () => {
  const [results, setResults] = useState([]);

  return (
    <>
      <UserSearchForm setResults={setResults} />
      <SearchResults results={results} />
    </>
  );
};

export type PrivateChat = {
  name: string;
  chat_type: ChatType.Private;
  users: [string, string];
};

const SearchListItem = ({ user }) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleMessageClick = () => {
    const chat: PrivateChat = {
      name: `${user.username}-${currentUser.username}`,
      chat_type: ChatType.Private,
      users: [user.id, currentUser.id],
    };
    dispatch(createChat(chat));
  };

  return (
    <li key={user.id} className="flex flex-row items-center justify-between">
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
        className={`ml-2 text-sm font-medium text-gray-500 dark:text-gray-300`}
        onClick={handleMessageClick}
      >
        Message
      </button>

      <StatusIndicator online={user.online} />
    </li>
  );
};

const SearchResults = ({ results }) => {
  return (
    <div className="px-4 pb-4 pt-5 text-gray-900 dark:text-gray-300 sm:p-6 sm:pb-4">
      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
        <ul className="flex flex-col">
          {results.map((user) => (
            <li>
              <SearchListItem key={user.id} user={user} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const UserSearchForm = ({ setResults }) => {
  const [username, setUsername] = useState("");
  const token = useAppSelector((state) => state.auth.token);

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;

    if (username) {
      searchUsersByName(username, token).then((res) => {
        console.log(res.data);
        setResults(res.data);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="px-4 pb-4 pt-5 text-gray-900 dark:text-gray-300 sm:p-6 sm:pb-4">
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <h3 className="text-lg font-medium leading-6">Start a new chat</h3>
          <div className="flex flex-col">
            <input
              type="search"
              name="username"
              className="mb-4 mt-1 rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-b-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
      </div>
    </form>
  );
};
