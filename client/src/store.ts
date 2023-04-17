import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./features/auth/authSlice";
import chatsReducer from "./features/chats/chatsSlice";
import usersReducer from "./features/users/usersSlice";
import { RootState } from "./types";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer,
    users: usersReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = (selector) =>
  useSelector(selector);

export default store;
