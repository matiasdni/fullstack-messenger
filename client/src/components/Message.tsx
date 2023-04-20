import { useAppSelector } from "../store";

export const Message = ({ message }) => {
  const username = useAppSelector((state) => state.auth.user?.username);

  const getTime = (date): string => {
    const time = new Date(date);
    return time
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        localeMatcher: "best fit",
      })
      .replace(".", ":");
  };

  return message?.user?.username === username ? (
    <div className="mb-2 flex justify-end">
      <div className="min-w-[20%] rounded bg-sky-200 px-3 py-2 dark:bg-sky-700">
        <p className="mt-1 text-sm">{message.content}</p>
        <p className="text-grey-dark mt-1  text-right text-xs">
          {getTime(message.createdAt)}
        </p>
      </div>
    </div>
  ) : (
    <div>
      <div className="mb-2 flex">
        <div className="min-w-[20%] rounded bg-gray-200 bg-opacity-70 px-3 py-2 dark:bg-gray-700">
          <p className="text-teal text-sm">{message.user.username}</p>
          <p className="mt-1 text-sm">{message.content}</p>
          <p className="text-grey-dark mt-1 text-right text-xs">
            {getTime(message.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};
