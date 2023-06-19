import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UsersInitialState } from "./types";

const initialState: UsersInitialState = {
  users: [],
  selectedUser: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    setSelectedUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload;
    },
  },
});

export default usersSlice.reducer;
