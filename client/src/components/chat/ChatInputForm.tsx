import { addMessage } from "features/chats/chatsSlice";
import { Chat } from "features/chats/types";
import { FC, FormEvent, useState } from "react";
import { sendMessage } from "services/chatService";
import { useAppDispatch } from "store";

interface InputFormProps {
  activeChat: Chat;
  token: string;
}

const ChatInputForm: FC<InputFormProps> = ({ activeChat }) => {
  const [input, setInput] = useState<string>("");
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim().length > 0) {
      try {
        const data = await sendMessage(activeChat.id, input);
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
      className="inline-flex items-center justify-between w-full p-4 space-x-2 rounded-t-lg shadow-inner bg-neutral-200/50 dark:bg-gray-800"
      onSubmit={handleSubmit}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 fill-neutral-600"
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
        className="w-full px-4 py-2 leading-normal border rounded-lg shadow-inner appearance-none focus:shadow-outline form-input border-neutral-300 bg-neutral-100 focus:outline-none dark:border-gray-700 dark:bg-gray-700"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button
        className="px-4 py-2 font-bold bg-blue-500 rounded shadow-md text-neutral-100 hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Send
      </button>
    </form>
  );
};

export default ChatInputForm;
