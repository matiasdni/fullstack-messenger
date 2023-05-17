import React, { useState } from "react";
import { socket } from "../socket";

export const UserSearchModal = ({ handleCloseModal }) => {
  const [results, setResults] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;

    if (username) {
      socket.once("search:user", (user) => {
        if (user) {
          console.log(user);
          setResults(user);
        } else {
          console.log("user does not exist");
        }
      });
      socket.emit("search:user", username);
    }
  };

  return (
    <>
      <UserSearchForm onSubmit={handleSubmit} />
      <SearchResults results={results} handleCloseModal={handleCloseModal} />
    </>
  );
};

const SearchListItem = ({ user, handleCloseModal }) => {
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

      <UserActionButton
        label="Message"
        color="blue"
        action="get:chatByUserId"
        userId={user.id}
      />
      <UserActionButton
        label="Add friend"
        color="gray"
        action="add:friend"
        userId={user.id}
      />

      <StatusIndicator online={user.online} />
    </li>
  );
};

const SearchResults = ({ results, handleCloseModal }) => {
  return (
    <div className="px-4 pb-4 pt-5 text-gray-900 dark:text-gray-300 sm:p-6 sm:pb-4">
      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
        <ul className="flex flex-col">
          {results.map((user) => (
            <SearchListItem
              key={user.id}
              user={user}
              handleCloseModal={handleCloseModal}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

function UserSearchForm({ onSubmit }: { onSubmit: (e) => void }) {
  const [username, setUsername] = useState("");

  return (
    <form onSubmit={onSubmit}>
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
}

const UserActionButton = ({ label, color, action, userId }) => {
  return (
    <button
      className={`ml-2 text-sm font-medium text-${color}-500 dark:text-${color}-300`}
      onClick={() => {
        socket.emit(action, userId);
      }}
    >
      {label}
    </button>
  );
};
