import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

function App() {
  return (
    <div>
      <h1>Real-time Chat App</h1>
      <Chat />
    </div>
  );
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3001', {
      transports: ['websocket'],
    });

    socketRef.current.on('receive-message', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socketRef.current?.emit('send-message', input);
      setInput('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <Message key={index} content={message} />
        ))}
      </div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

interface MessageProps {
  content: string;
}

const Message: React.FC<MessageProps> = ({ content }) => {
  return <div>{content}</div>;
};

export default App;
