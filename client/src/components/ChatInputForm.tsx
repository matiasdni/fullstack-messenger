import React, { useState } from "react";

interface InputFormProps {
  onSubmit: (input: string) => void;
}

export const ChatInputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [input, setInput] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length > 0) {
      onSubmit(input);
      setInput("");
    }
  };

  return (
    <form
      className="flex items-center justify-between space-x-2 bg-transparent p-3"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="focus:shadow-outline form-input w-full appearance-none rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2 leading-normal focus:outline-none dark:border-gray-700 dark:bg-gray-700"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-neutral-100 shadow-md hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Send
      </button>
    </form>
  );
};
