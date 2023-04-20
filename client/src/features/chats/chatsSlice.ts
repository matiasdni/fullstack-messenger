import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Chat, ChatState, Message } from "./types";
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
      const chat: Chat = state.chats?.find((chat) => chat.id === chatId);
      const existingMessage = chat?.messages?.find(
        (message) => message.id === action.payload.id
      );
      if (chat && !existingMessage) {
        chat.messages = [...chat.messages, action.payload];
        if (state.activeChat?.id === chatId) {
          console.log("adding message to active chat");
          state.activeChat.messages = chat.messages;
        }
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

export const addMessage = createAction<{
  chatId: string;
  message: Message;
}>("chats/addMessage");

export const selectChats = (state: RootState) => state.chats.chats;

export const selectActiveChat = (state: RootState) => state.chats.activeChat;

export const { setActiveChat } = chatsSlice.actions;
export default chatsSlice.reducer;
