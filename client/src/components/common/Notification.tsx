import { RootState } from "@/types";
import { clearNotification } from "@/features/notification/notificationSlice";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "store";
import { clsx } from "clsx";

const Notification = () => {
  const dispatch = useAppDispatch();
  const { message, status } = useAppSelector(
    (state: RootState) => state.notifications
  );

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
    }
  }, [dispatch, message]);

  const handleClose = () => {
    dispatch(clearNotification());
  };

  if (!message) return null;

  return (
    <div
      className={clsx({
        "alert-success": status === "success",
        "alert-error": status === "error",
        "alert shadow-sm shadow-base-content/75 fixed left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 top-0 z-[100] my-12 max-w-md w-full flex items-center justify-between":
          true,
      })}
    >
      <div className="flex-1">
        <label>{message}</label>
      </div>
      <button className="ml-4" onClick={handleClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Notification;
