import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../../services/auth";
import { AuthState, LoginData, User } from "./types";

const initialState = {
  user: null as User | null,
  token: null as string | null,
};

export const login = createAsyncThunk(
  "/login",
  async (loginData: LoginData) => {
    return (await loginUser(loginData)) as AuthState;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut(state) {
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state = action.payload;
      localStorage.setItem("token", action.payload.token);

      return state;
    });

    builder.addCase(login.rejected, (state, action) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
    });

    builder.addCase(login.pending, (state, action) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
    });
  },
});

export const { logOut } = authSlice.actions;

export default authSlice.reducer;
