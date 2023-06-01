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
      className="flex items-center justify-between space-x-2 rounded-t-lg bg-neutral-200/50 p-4 shadow-inner dark:bg-gray-800"
      onSubmit={handleSubmit}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 fill-neutral-600"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="{2}"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>

      <input
        type="text"
        className="focus:shadow-outline form-input w-full appearance-none rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2 leading-normal shadow-inner focus:outline-none dark:border-gray-700 dark:bg-gray-700"
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
