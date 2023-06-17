import { configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import { ActionsFromAsyncThunk } from "@reduxjs/toolkit/src/matchers";
import notificationReducer from "features/notification/notificationSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState } from "types";
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
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
