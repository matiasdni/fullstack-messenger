import { addMessage } from "features/chats/chatsSlice";
import { Chat } from "features/chats/types";
import { FC, useState } from "react";
import { sendMessage } from "services/chats";
import { useAppDispatch } from "store";

interface InputFormProps {
  activeChat: Chat;
  token: string;
}

const ChatInputForm: FC<InputFormProps> = ({ activeChat, token }) => {
  const [input, setInput] = useState<string>("");
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length > 0) {
      try {
        const data = await sendMessage(activeChat.id, input, token);
        console.log("data", data);
        dispatch(addMessage(data));
        setInput("");
      } catch (error) {
        console.log(error);
      }
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

export default ChatInputForm;
