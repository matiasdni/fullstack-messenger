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
    setUserChatInvites(state, action) {
      state.user = {
        ...state.user,
        chatInvites: action.payload,
      };
    },
    addFriendRequest(state, action) {
      state.user = {
        ...state.user,
        friendRequests: [...state.user.friendRequests, action.payload],
      };
    },
    updateFriendRequest(state, action) {
      const friendRequests = state.user.friendRequests.map((friendRequest) => {
        if (friendRequest.id === action.payload.friendId) {
          return {
            ...friendRequest,
            status: action.payload.status,
          };
        }
        return friendRequest;
      });
      state.user = {
        ...state.user,
        friendRequests,
      };
    },
    removeFriendRequest(state, action) {
      const friendRequests = state.user.friendRequests.filter(
        (friendRequest) => friendRequest.id !== action.payload
      );
      state.user = {
        ...state.user,
        friendRequests,
      };
    },
    removeChatInvite(state: AuthState, action) {
      const inviteToRemove = state.user.chatInvites.invites.find(
        (invite) => invite.id === action.payload
      );

      state.user = {
        ...state.user,
        chatInvites: {
          ...state.user.chatInvites,
          invites: state.user.chatInvites.invites.filter(
            (invite) => invite.id !== action.payload
          ),
          chats: Object.keys(state.user.chatInvites.chats).reduce(
            (acc, key) => {
              if (key !== inviteToRemove.chatId) {
                acc[key] = state.user.chatInvites.chats[key];
              }
              return acc;
            },
            {}
          ),
          senders: Object.keys(state.user?.chatInvites.senders).reduce(
            (acc, key) => {
              if (key !== inviteToRemove?.senderId) {
                acc[key] = state.user?.chatInvites.senders[key];
              }
              return acc;
            },
            {}
          ),
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("username", action.payload.user.username);
      localStorage.setItem("userId", action.payload.user.id);
    });

    builder.addCase(login.rejected, (state, _action) => {
      state.user = null;
      state.token = null;

      removeTokenFromStorage();
    });

    builder.addCase(login.pending, (state, _action) => {
      state.user = null;
      state.token = null;

      removeTokenFromStorage();
    });
  },
});

export const {
  logOut,
  setAuth,
  addFriendRequest,
  removeFriendRequest,
  updateFriendRequest,
  setUserChatInvites,
} = authSlice.actions;

export default authSlice.reducer;
