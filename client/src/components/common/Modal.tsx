import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { socket } from "../../socket";

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
        action="start:chat"
        userId={user.id}
        handleCloseModal={handleCloseModal}
      />
      <UserActionButton
        label="Add friend"
        color="gray"
        action="add:friend"
        userId={user.id}
        handleCloseModal={handleCloseModal}
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

function UserSearchForm(props: {
  onSubmit: (e) => void;
  value: string;
  onChange: (e) => void;
}) {
  return (
    <form onSubmit={props.onSubmit}>
      <div className="px-4 pb-4 pt-5 text-gray-900 dark:text-gray-300 sm:p-6 sm:pb-4">
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <h3 className="text-lg font-medium leading-6">Start a new chat</h3>
          <div className="flex flex-col">
            <input
              type="text"
              id="name"
              className="mb-4 mt-1 rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-b-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder={"Username"}
              required
              value={props.value}
              onChange={props.onChange}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

const UserActionButton = ({
  label,
  color,
  action,
  userId,
  handleCloseModal,
}) => (
  <button
    className={`ml-2 text-sm font-medium text-${color}-500 dark:text-${color}-300`}
    onClick={() => {
      socket.emit(action, userId);
      handleCloseModal();
    }}
  >
    {label}
  </button>
);

export const Modal = ({ handleCloseModal }) => {
  const [visible, setVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [results, setResults] = useState([]); // [{username, id}]
  const ref = useRef(null);

  // handle click outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (visible && ref.current && !ref.current.contains(event.target)) {
        handleCloseModal();
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleCloseModal, visible]);

  // handle modal visibility
  useEffect(() => {
    document.body.style.overflow = "hidden";
    setVisible(true);

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

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

  return createPortal(
    <div
      className={
        "fixed inset-0 z-10 h-full w-full overflow-y-auto bg-gray-900 bg-opacity-25 dark:bg-opacity-70"
      }
    >
      <div className="px-4 pb-20 pt-4 text-center sm:block sm:p-0 ">
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" />
        <div
          ref={ref}
          className="inline-block transform overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
          role="dialog"
        >
          <UserSearchForm
            onSubmit={handleSubmit}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <SearchResults
            results={results}
            handleCloseModal={handleCloseModal}
          />
        </div>
      </div>
    </div>,
    document.getElementById("modal")
  );
};
