import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
    // addChat: (state, action: PayloadAction<Chat>) => {
    //   state.push(action.payload);
    // },
    // addMessage: (
    //   state,
    //   action: PayloadAction<{ chatId: string; message: Message }>
    // ) => {
    //   const { chatId, message } = action.payload;
    //   const chat = state.find((chat) => chat.id === chatId);
    //   if (chat) {
    //     chat.messages.push(message);
    //   }
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(getChats.fulfilled, (state, action) => {
      state.chats = action.payload;
    });
  },
});

export const sendMessage = createAction<{
  content: string;
  sender: string;
}>("chats/sendMessage");

export const selectChats = (state: RootState) => state.chats.chats;

export const selectActiveChat = (state: RootState) => state.chats.activeChat;

export const { setActiveChat } = chatsSlice.actions;
export default chatsSlice.reducer;
