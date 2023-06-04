import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { chatData, fetchChatById, newChat } from "../../services/chats";
import { fetchUserChats } from "../../services/user";
import { RootState } from "../../types";
import { Chat } from "./types";

const initialState = {
  chats: [] as Chat[],
  activeChatId: null as string | null,
};

export enum ChatTypeEnum {
  group,
  private,
}

export type ChatType = keyof typeof ChatTypeEnum;

export const getChats = createAsyncThunk(
  "chats/getChats",
  async (token: string, { rejectWithValue, getState }) => {
    try {
      const userId = (getState() as RootState).auth.user.id;
      return await fetchUserChats(userId, token);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createChat = createAsyncThunk(
  "chats/createChat",
  async (chatData: chatData, { rejectWithValue, getState }): Promise<Chat> => {
    const token = (getState() as RootState).auth.token;
    try {
      return await newChat(chatData, token);
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const getChatById = createAsyncThunk(
  "chats/getChatById",
  async (chatId: string, { rejectWithValue, getState }): Promise<Chat> => {
    const token = (getState() as RootState).auth.token;
    try {
      return await fetchChatById(chatId, token);
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<string>) => {
      state.activeChatId = action.payload;
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
        chat.updatedAt = action.payload.createdAt;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChats.fulfilled, (state, action) => {
      state.chats = action.payload;
    });
    builder.addCase(createChat.fulfilled, (state, action) => {
      if (!state.chats?.some((chat) => chat.id === action.payload.id)) {
        state.chats?.push(action.payload);
      }
    });
    builder.addCase(getChatById.fulfilled, (state, action) => {
      // If chat is already in state, update it
      const chatIndex = state.chats?.findIndex(
        (chat) => chat.id === action.payload.id
      );
      if (chatIndex !== -1) {
        state.chats[chatIndex] = action.payload;
      } else {
        state.chats.push(action.payload);
      }
    });
  },
});

export const selectChats = (state: RootState) => state.chats.chats;

export const selectActiveChat = (state: RootState) => {
  const activeChatId = state.chats.activeChatId;
  if (!activeChatId) return null;
  return state.chats.chats.find((chat) => chat.id === activeChatId);
};

export const { setActiveChat, addMessage, addChat } = chatsSlice.actions;
export default chatsSlice.reducer;
