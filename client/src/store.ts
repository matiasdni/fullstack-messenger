import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./features/auth/authSlice";
import chatsReducer from "./features/chats/chatsSlice";
import usersReducer from "./features/users/usersSlice";
import { RootState } from "./types";
import inviteReducer from "./features/invites/inviteSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer,
    users: usersReducer,
    invites: inviteReducer,
  },
  // preloadedState: {
  //   auth: {
  //     token: localStorage.getItem("token"),
  //     user: {
  //       id: localStorage.getItem("id"),
  //       username: localStorage.getItem("username"),
  //     },
  //   },
  // },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = (selector) =>
  useSelector(selector);

export default store;
