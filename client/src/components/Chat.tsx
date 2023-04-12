import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Message } from "./Message";

interface ChatProps {
  onLogout: () => void;
}

export const Chat: React.FC<ChatProps> = ({ onLogout }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3001", {
      transports: ["polling", "websocket"],
    });

    socketRef.current.on("receive-message", (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socketRef.current?.emit("send-message", input);
      setInput("");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <div className="flex items-center justify-between bg-gray-800 p-4 shadow-md">
        <h1 className="text-2x1">Chat</h1>
        <button
          onClick={onLogout}
          className="rounded bg-red-600 px-4 py-2 transition-colors hover:bg-red-500"
        >
          Logout
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <Message key={index} content={message} />
        ))}
      </div>
      <div className="flex items-center bg-gray-800 p-4 shadow-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="rounded bg-blue-600 px-4 py-2 transition-colors hover:bg-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};
