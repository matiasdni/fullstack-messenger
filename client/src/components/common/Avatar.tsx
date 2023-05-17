import React from "react";

export const Avatar = ({ avatarUrl }: { avatarUrl?: string }) => {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          className="h-full w-full object-cover"
          alt="User avatar"
        />
      ) : (
        <svg
          className="h-3/4 w-3/4 fill-current text-gray-400"
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
