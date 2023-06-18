import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setNotification } from "features/notification/notificationSlice";
import { loginUser } from "services/authService";
import { removeTokenFromStorage } from "utils/localStorage";
import { User } from "../users/types";
import { AuthInitialState, AuthState, LoginData } from "./types";

const initialState: AuthInitialState = {
  user: null,
  token: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (loginData: LoginData, thunkAPI) => {
    try {
      const { user, token } = (await loginUser(loginData)) as AuthState;
      return { user, token };
    } catch (error) {
      thunkAPI.dispatch(
        setNotification({ message: error.message, status: "error" })
      );
      return thunkAPI.rejectWithValue(error);
    }
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
      const friendRequest = state.user.friendRequests.find(
        (friendRequest) => friendRequest.id === action.payload.id
      );
      if (friendRequest && friendRequest.status === "rejected") {
        friendRequest.status = action.payload.status;
      } else {
        state.user = {
          ...state.user,
          friendRequests: [...state.user.friendRequests, action.payload],
        };
      }
    },
    addSentFriendRequest(state, action) {
      state.user = {
        ...state.user,
        sentFriendRequests: [...state.user.sentFriendRequests, action.payload],
      };
    },
    updateFriendRequest(state, action) {
      const request = state.user.friendRequests.find(
        (friendRequest) =>
          friendRequest.userId === action.payload.userId &&
          friendRequest.friendId === action.payload.friendId
      );
      if (!request) return;
      request.status = action.payload.status;
    },
    removeFriendRequest(state, action) {
      const friendRequests = state.user.friendRequests.filter(
        (friendRequest) => friendRequest.userId !== action.payload.userId
      );
      state.user = {
        ...state.user,
        friendRequests,
      };
    },
    addFriend(state, action: PayloadAction<User>) {
      if (state.user.friends.find((friend) => friend.id === action.payload.id))
        return;
      state.user.friends = [...state.user.friends, action.payload];
    },
    removeSentFriendRequest(state, action) {
      const sentFriendRequests = state.user.sentFriendRequests.filter(
        (friendRequest) => friendRequest.id !== action.payload
      );
      state.user = {
        ...state.user,
        sentFriendRequests,
      };
    },
    removeChatInvite(state: AuthState, action) {
      const inviteToRemove = state.user.chatInvites.invites.find(
        (invite) => invite.id === action.payload.id
      );

      state.user = {
        ...state.user,
        chatInvites: {
          ...state.user.chatInvites,
          invites: state.user.chatInvites.invites.filter(
            (invite) => invite.id !== action.payload.id
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
    addChatInvite(state, action) {
      const { chat, sender, invite } = action.payload;
      state.user.chatInvites.invites = [
        ...state.user.chatInvites.invites,
        invite,
      ];
      state.user.chatInvites.chats = {
        ...state.user.chatInvites.chats,
        [invite.chatId]: chat,
      };
      state.user.chatInvites.senders = {
        ...state.user.chatInvites.senders,
        [invite.senderId]: sender,
      };
    },
    // for delta updates from socket
    updateUser(state, action) {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    });

    builder.addCase(login.rejected, (state, _action) => {
      state.user = null;
      state.token = null;
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
  addSentFriendRequest,
  removeSentFriendRequest,
  addFriend,
  updateUser,
  removeChatInvite,
  addChatInvite,
} = authSlice.actions;

export default authSlice.reducer;
