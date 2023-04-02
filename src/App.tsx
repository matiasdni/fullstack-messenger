import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    // Connect to the server
    // add received messages to the state
    setMessages(["Hello", "World"]);
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      // Send message to the server
      setMessages([...messages, input]);
      setInput("");
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
