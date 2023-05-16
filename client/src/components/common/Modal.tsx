import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const Modal = ({ handleCloseModal }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (visible && ref.current && !ref.current.contains(event.target)) {
        handleCloseModal();
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleCloseModal, visible]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setVisible(true);

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return createPortal(
    <div
      className={
        "fixed inset-0 z-10 h-full w-full overflow-y-auto bg-gray-900 bg-opacity-25 dark:bg-opacity-70"
      }
    >
      <div className="px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" />
        <div
          ref={ref}
          className="inline-block transform overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
          role="dialog"
        >
          <form onSubmit={null}>
            <div className="px-4 pb-4 pt-5 text-gray-900 dark:text-gray-300 sm:p-6 sm:pb-4">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6">
                  Start a new chat
                </h3>
                <div className="flex flex-col">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="mb-4 mt-1 rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-b-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder={"Username"}
                    required
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.getElementById("modal")
  );
};
