import { useUser } from "hooks/useAuth";

const getTime = (date: Date): string => {
  const time = new Date(date);
  return time
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      localeMatcher: "best fit",
    })
    .replace(".", ":");
};

export const Message = ({ message }) => {
  const { username } = useUser();

  return message.user?.username === username ? (
    <div className="mb-2 flex w-full items-center justify-end">
      <div className="flex min-w-[72px] max-w-3/4 shrink-0 flex-col overflow-auto break-words rounded bg-sky-200 p-2 dark:bg-sky-700">
        <p className=" cursor-default text-sm">{message?.content}</p>
        <p className="text-grey-dark mt-0.5 self-end text-xs">
          {getTime(message?.createdAt)}
        </p>
      </div>
      <div className="w-2" />
      <img
        className="inline-block h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-600 dark:bg-opacity-50"
        src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${message.user?.username}`}
        alt=""
      />
    </div>
  ) : (
    <>
      <div className="mb-2 flex w-full shrink-0 items-center">
        <img
          className="inline-block h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-600 dark:bg-opacity-50"
          src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${message.user?.username}`}
          alt=""
        />
        <div className="w-2"></div>
        <div className="flex max-w-3/4 shrink-0 flex-col overflow-auto break-words rounded-lg bg-gray-200 bg-opacity-70 p-2 dark:bg-gray-700">
          <p className="text-teal text-sm">{message?.user.username}</p>
          <p className="mt-1 text-sm">{message?.content}</p>
          <p className="text-grey-dark mt-1 text-right text-xs chat-footer">
            {getTime(message?.createdAt)}
          </p>
        </div>
      </div>
    </>
  );
};
