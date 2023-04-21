import React from "react";

export const Avatar = () => {
  return (
    <div className="h-full w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
      <svg
        className="fill-current pt-1 text-gray-400"
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
