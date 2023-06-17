export const Avatar = ({ avatarUrl }: { avatarUrl?: string }) => {
  return (
    <div className="flex items-center justify-center w-full h-full overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          className="object-cover w-full h-full"
          alt="User avatar"
        />
      ) : (
        <svg
          className="w-3/4 text-gray-400 fill-current h-3/4"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          ></path>
        </svg>
      )}
    </div>
  );
};
