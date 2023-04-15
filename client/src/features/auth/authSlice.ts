import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../../services/auth";

type LoginData = {
  username: string;
  password: string;
};

type user = {
  id: number;
  username: string;
  role: string;
};

interface AuthState {
  user: user | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

export const login = createAsyncThunk(
  "/login",
  async (loginData: LoginData) => {
    const { token, user } = await loginUser(loginData);
    return { token, user };
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
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem("token", action.payload.token);
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
