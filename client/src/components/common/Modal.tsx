import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const Modal = ({ children, handleCloseModal }) => {
  const [visible, setVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef(null);
  const handleClose = () => {
    setIsAnimating(true);
  };

  // handle click outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        visible &&
        !isAnimating &&
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        handleClose();
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [visible, isAnimating]);

  // handle modal visibility
  useEffect(() => {
    document.body.style.overflow = "hidden";
    setVisible(true);
    setIsAnimating(false);
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return createPortal(
    <div
      className={`fixed inset-0 z-10 h-full w-full overflow-y-auto ${
        isAnimating ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      <div
        className={`fixed inset-0 bg-gray-900 dark:bg-black ${
          isAnimating ? "animate-bg-fade-out" : "animate-bg-fade-in"
        }`}
      />
      <div className=" px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" />
        <div
          ref={ref}
          className={`inline-block transform overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800 dark:shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:align-middle ${
            isAnimating ? "animate-fade-out-up" : "animate-fade-in-down"
          }`}
          role="dialog"
          onAnimationEnd={() => {
            if (isAnimating) {
              setVisible(false);
              handleCloseModal();
            }
          }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.getElementById("modal")
  );
};
