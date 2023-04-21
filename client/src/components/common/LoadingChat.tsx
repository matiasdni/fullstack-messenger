import React from "react";

export const LoadingChat: React.FC = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="loader mb-4 h-12 w-12 rounded-full border-4 border-t-4 border-solid border-gray-200"></div>
      <h2 className="text-center text-xl font-semibold">Loading chats...</h2>
    </div>
  );
};
