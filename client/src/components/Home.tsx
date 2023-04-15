import React, { Fragment, useEffect, useState } from "react";
import { useAppSelector } from "../store";
import { Avatar } from "./Avatar";
import { Chat } from "./Chat";
import { socket } from "../socket";
import { message } from "./Message";

const ChatItem = ({ chatName, lastMessage, time }) => {
  return (
    <li className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
      <div className="flex p-3 items-center">
        <figure className="flex-none h-10 w-10 min-w-10">
          <Avatar />
        </figure>
        <div className="flex flex-col justify-center overflow-hidden ml-2">
          <div className="flex grow flex-nowrap flex-row items-center justify-between whitespace-nowrap">
            <p className="font-bold">{chatName}</p>

            <p className="text-xs">{time}</p>
          </div>
          <p className="text-sm truncate align-top">
            asdsadsadsadsadasdasdsadasdasdasuuiuhiuihuihuhihuiuhiuihuhi
          </p>
        </div>
      </div>
    </li>
  );
};

const ChatList = () => {
  return (
    <ul className="overflow-y-auto max-w-1/3 overflow-x-hidden">
      <ChatItem chatName="Chat 1" lastMessage="Hello" time="12:00" />
      <ChatItem chatName="Chat 2" lastMessage="Hello" time="12:00" />
      <ChatItem chatName="Chat 3" lastMessage="Hello" time="12:00" />
    </ul>
  );
};

const Modal = ({
  openModal,
  handleCreateChat,
  cancelBtnRef,
  handleCloseModal,
}) => {
  return (
    <div
      className={openModal ? "fixed z-10 inset-0 overflow-y-auto" : "hidden"}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <form onSubmit={handleCreateChat}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-headline"
                  >
                    Create new chat
                  </h3>
                  <div className="mt-2">
                    <div className="flex flex-col">
                      <label
                        htmlFor="name"
                        className="leading-7 text-sm text-gray-600"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="flex flex-col mt-4">
                      <label
                        htmlFor="users"
                        className="leading-7 text-sm text-gray-600"
                      >
                        Users
                      </label>
                      <input
                        type="text"
                        id="users"
                        name="users"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Create
              </button>
              <button
                type="button"
                ref={cancelBtnRef}
                onClick={handleCloseModal}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const cancelBtnRef = React.useRef(null);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCreateChat = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const users = e.target.users.value;

    const chatGroup = {
      name,
      users: users.split(",").map((user) => user.trim()),
    };
  };

  return (
    <section className="w-1/3 border border-collapse">
      {/* modal */}
      {openModal && (
        <Modal
          openModal={handleOpenModal}
          handleCloseModal={handleCloseModal}
          handleCreateChat={handleCreateChat}
          cancelBtnRef={cancelBtnRef}
        />
      )}
      <header className="py-2 gap-2 px-3 bg-gray-200 dark:bg-gray-800 flex flex-row items-center">
        <div className="h-10 w-10">
          <Avatar />
        </div>
        <h1 className="text-xl">
          Welcome <span>{user?.username}</span>
        </h1>
        {/* plus icon to add room/group */}
        <div className="flex-grow"></div>
        <div className="flex-none" onClick={handleOpenModal}>
          <span className="text-2xl">+</span>
        </div>
      </header>

      {/* chats list */}
      <ChatList />
    </section>
  );
};

export const Home = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [chatEvents, setChatEvents] = useState<message[]>([]);
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      console.log("socketio connected");
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log("socketio disconnected");
    };
    if (user) {
      socket.auth = { token };
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.connect();
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [user]);

  useEffect(() => {
    // chat events
    const onChatMessage = (message) =>
      setChatEvents(chatEvents.concat(message));

    socket.on("message", onChatMessage);

    return () => {
      socket.off("chat-message", onChatMessage);
    };
  }, [chatEvents]);

  return (
    <main className="container mx-auto text-neutral-900 dark:text-neutral-300">
      <div className="flex border border-gray border-collapse rounded shadow-lg">
        <Sidebar />
        <Chat
          chatEvents={chatEvents}
          setChatEvents={setChatEvents}
          chat={{ id: "1", name: "Chat 1", users: ["user1", "user2"] }}
        />
      </div>
    </main>
  );
};
