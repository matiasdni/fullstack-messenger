import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ChatState } from "./types";
import { RootState } from "../../types";
import { fetchChats } from "../../services/chats";

const initialState = {
  chats: null,
  activeChat: null,
};

export const getChats = createAsyncThunk(
  "chats/getChats",
  async (token: string, { rejectWithValue }) => {
    try {
      const chats = await fetchChats(token);
      console.log("chats", chats);
      return chats as ChatState;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action) => {
      const { chatId } = action.payload;
      const chatIndex = state.chats?.findIndex((chat) => chat.id === chatId);

      if (chatIndex === -1) {
        return;
      }

      const chat = state.chats[chatIndex];

      const existingMessage = chat.messages.some(
        (message) => message.id === action.payload.id
      );

      if (existingMessage) {
        return;
      }

      chat.messages.push(action.payload);

      if (state.activeChat?.id === chatId) {
        state.activeChat.messages = chat.messages;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChats.fulfilled, (state, action) => {
      state.chats = action.payload;
      state.activeChat = action.payload[0];
    });
  },
});

export const selectChats = (state: RootState) => state.chats.chats;

export const selectActiveChat = (state: RootState) => state.chats.activeChat;

export const { setActiveChat, addMessage } = chatsSlice.actions;
export default chatsSlice.reducer;
