import { addSentFriendRequest } from "features/auth/authSlice";
import { useAuth } from "hooks/useAuth";
import { useState } from "react";
import { createChat } from "../features/chats/chatsSlice";
import { chatData } from "../services/chats";
import { searchUsersByName, sendFriendRequest } from "../services/user";
import { useAppDispatch, useAppSelector, useThunkDispatch } from "../store";

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

const SearchListItem = ({ user }) => {
  const { user: currentUser, token } = useAuth();
  const dispatch = useAppDispatch();
  const thunkDispatch = useThunkDispatch();

  const handleMessageClick = async () => {
    const chat: chatData = {
      name: `${user.username}-${currentUser.username}`,
      chat_type: "private",
      userIds: [user.id],
    };

    await thunkDispatch(createChat(chat));
  };

  const handleAddFriendClick = async () => {
    const friendRequest = await sendFriendRequest(
      currentUser.id,
      user.id,
      token
    );
    console.log(friendRequest);
    dispatch(addSentFriendRequest(friendRequest));
  };

  return (
    <li key={user.id} className="flex flex-row items-center">
      <div className="inline-flex grow basis-1/3 items-center">
        <img
          className="inline-block h-8 w-8 rounded-full"
          src={`https://avatars.dicebear.com/api/identicon/${user.username}.svg`}
          alt=""
        />
        <p className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          {user.username}
        </p>
      </div>
      <div className="grow basis-1/4 justify-center text-center">
        <button
          className={`text-sm font-medium text-gray-500 dark:text-gray-300`}
          onClick={handleAddFriendClick}
        >
          Add Friend
        </button>
      </div>
      <div className="grow basis-1/4 text-center">
        <button
          className={`text-sm font-medium text-gray-500 dark:text-gray-300`}
          onClick={handleMessageClick}
        >
          Message
        </button>
      </div>

      <StatusIndicator online={user.online} />
    </li>
  );
};

const SearchResults = ({ results }) => {
  return (
    <div className="px-4 pb-4 pt-5 text-gray-900 dark:text-gray-300 sm:p-6 sm:pb-4">
      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
        <ul className="flex flex-col space-y-2">
          {results.map((user) => (
            <SearchListItem key={user.id} user={user} />
          ))}
        </ul>
      </div>
    </div>
  );
};

const UserSearchForm = ({ setResults }) => {
  const [username, setUsername] = useState("");
  const token = useAppSelector((state) => state.auth.token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;

    if (username) {
      const users = await searchUsersByName(username, token);
      setResults(users);
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
