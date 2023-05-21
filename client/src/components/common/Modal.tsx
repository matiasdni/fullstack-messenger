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
      className={`fixed inset-0 z-10 flex h-full w-full items-center justify-center overflow-hidden bg-transparent ${
        isAnimating ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      <div
        className={`fixed inset-0 bg-gray-900 dark:bg-black ${
          isAnimating ? "animate-bg-fade-out" : "animate-bg-fade-in"
        }`}
      />
      <div
        ref={ref}
        className={`transform rounded-lg bg-white shadow-md dark:bg-gray-800 dark:shadow-xl sm:w-full sm:max-w-lg ${
          isAnimating ? "animate-fade-out-up" : "animate-fade-in-down"
        }`}
        onAnimationEnd={() => {
          if (isAnimating) {
            setVisible(false);
            handleCloseModal();
          }
        }}
        role="dialog"
      >
        {children}
      </div>
    </div>,
    document.getElementById("modal")
  );
};
