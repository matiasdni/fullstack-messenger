import React from "react";

interface MessageProps {
  content: string;
}

export const Message: React.FC<MessageProps> = ({ content }) => {
  return (
    <div className="mb-4 rounded-lg bg-gray-700 p-4 shadow">
      <p>{content}</p>
    </div>
  );
};
