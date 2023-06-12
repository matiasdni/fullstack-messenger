import { configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import { ActionsFromAsyncThunk } from "@reduxjs/toolkit/src/matchers";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer, { login } from "./features/auth/authSlice";
import chatsReducer, {
  createChat,
  getChatById,
  getChats,
} from "./features/chats/chatsSlice";
import inviteReducer, {
  getInvites,
  rejectInvite,
  updateInviteStatus,
} from "./features/invites/inviteSlice";
import usersReducer from "./features/users/usersSlice";
import { RootState } from "types";
import notificationReducer from "features/notification/notificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer,
    users: usersReducer,
    invites: inviteReducer,
    notifications: notificationReducer,
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
export const useThunkDispatch = (): ThunkDispatch<
  RootState,
  void,
  ActionsFromAsyncThunk<
    | typeof createChat
    | typeof getChats
    | typeof updateInviteStatus
    | typeof rejectInvite
    | typeof getInvites
    | typeof getChatById
    | typeof login
  >
> => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = (selector) =>
  useSelector(selector);

export default store;
