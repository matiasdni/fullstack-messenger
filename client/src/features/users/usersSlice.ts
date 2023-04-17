import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UsersInitialState } from "./types";
import { RootState } from "../../types";

const initialState: UsersInitialState = [];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.push(action.payload);
    },
  },
});

export const { addUser } = usersSlice.actions;
export const selectUsers = (state: RootState) => state.users;
export default usersSlice.reducer;