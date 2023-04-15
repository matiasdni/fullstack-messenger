import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch; // Export a hook that can be reused to resolve types
export const useAppSelector = (selector: (state: RootState) => any) =>
  useSelector(selector);
export default store;
