import React from "react";

export const Avatar = () => {
  return (
    <div className="h-full w-full overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
      <svg
        className="text-gray-400 pt-1 fill-current"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        ></path>
      </svg>
    </div>
  );
};
