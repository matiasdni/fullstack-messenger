import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../../services/auth";
import { AuthInitialState, AuthState, LoginData } from "./types";
import { removeTokenFromStorage } from "../../utils/localStorage";

const initialState: AuthInitialState = {
  user: null,
  token: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (loginData: LoginData) => {
    const { user, token } = (await loginUser(loginData)) as AuthState;
    return { user, token };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut(state) {
      state.user = null;
      state.token = null;

      removeTokenFromStorage();
    },
    setAuth(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("username", action.payload.user.username);
    });

    builder.addCase(login.rejected, (state, action) => {
      state.user = null;
      state.token = null;

      removeTokenFromStorage();
    });

    builder.addCase(login.pending, (state, action) => {
      state.user = null;
      state.token = null;

      removeTokenFromStorage();
    });
  },
});

export const { logOut, setAuth } = authSlice.actions;

export default authSlice.reducer;
