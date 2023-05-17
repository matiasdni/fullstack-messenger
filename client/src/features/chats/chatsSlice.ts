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
      return chats.filter((chat) => {
        if (chat.chat_type === "group") return true;
        return chat.messages.length > 0;
      }) as ChatState;
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
    addChat: (state, action) => {
      if (state.chats.some((chat) => chat.id === action.payload.id)) return;
      state.chats.push(action.payload);
    },
    addMessage: (state, action) => {
      const { chatId } = action.payload;
      const chatIndex = state.chats?.findIndex((chat) => chat.id === chatId);

      if (chatIndex === -1) {
        return;
      }

      const chat = state.chats[chatIndex];

      const existingMessage = chat.messages?.some(
        (message) => message.id === action.payload.id
      );

      if (!existingMessage) {
        chat.messages?.push(action.payload);
        if (state.activeChat?.id === chatId) {
          state.activeChat.messages = chat.messages;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChats.fulfilled, (state, action) => {
      state.chats = action.payload;
      // Sort chats by last message date
      state.chats = state.chats?.sort((a, b) => {
        const aDate = new Date(a.updatedAt);
        const bDate = new Date(b.updatedAt);
        return bDate.getTime() - aDate.getTime();
      });
    });
  },
});

export const selectChats = (state: RootState) => state.chats.chats;

export const selectActiveChat = (state: RootState) => state.chats.activeChat;

export const { setActiveChat, addMessage, addChat } = chatsSlice.actions;
export default chatsSlice.reducer;
