import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "features/notification/notificationSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState } from "types";
import authReducer from "./features/auth/authSlice";
import chatsReducer from "./features/chats/chatsSlice";
import inviteReducer from "./features/invites/inviteSlice";
import usersReducer from "./features/users/usersSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer,
    users: usersReducer,
    invites: inviteReducer,
    notifications: notificationReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
