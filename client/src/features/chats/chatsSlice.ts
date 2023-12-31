import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { chatData, fetchChatById, newChat } from "services/chatService";
import { fetchUserChats } from "services/userService";
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
      return await fetchUserChats(userId);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createChat = createAsyncThunk(
  "chats/createChat",
  async (chatData: chatData, { rejectWithValue }): Promise<Chat> => {
    try {
      return await newChat(chatData);
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const getChatById = createAsyncThunk(
  "chats/getChatById",
  async (chatId: string, { rejectWithValue }): Promise<Chat> => {
    try {
      return await fetchChatById(chatId);
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
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
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
    updateChat: (state, action) => {
      const { id, ...chatData } = action.payload;
      const chatIndex = state.chats?.findIndex((chat) => chat.id === id);
      if (chatIndex !== -1) {
        state.chats[chatIndex] = {
          ...state.chats[chatIndex],
          ...chatData,
        };
      }
    },
    removeChat: (state, action) => {
      const chatIndex = state.chats?.findIndex(
        (chat) => chat.id === action.payload
      );
      if (chatIndex !== -1) {
        state.chats?.splice(chatIndex, 1);
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
export const selectActiveChat = (state: RootState) => {
  const activeChatId = state.chats.activeChatId;
  if (!activeChatId) return null;
  return state.chats.chats.find((chat) => chat.id === activeChatId);
};

export const {
  setActiveChat,
  addMessage,
  addChat,
  updateChat,
  removeChat,
  setChats,
} = chatsSlice.actions;

export default chatsSlice.reducer;

export const setActiveChatToUser = createAsyncThunk(
  "chats/setActiveChatToUser",
  async (userId: string, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const currentUserId = state.auth.user.id;
    // get private chat with userId and currentUser.id
    const privateChat = state.chats.chats.find((chat) => {
      const chatUsers = chat.users.map((u) => u.id);
      return (
        chat.chat_type === "private" &&
        chatUsers.includes(userId) &&
        chatUsers.includes(currentUserId)
      );
    });
    if (privateChat) {
      thunkAPI.dispatch(setActiveChat(privateChat.id));
      return;
    }
    // if not found, create new private chat
    const newChatData: chatData = {
      chat_type: "private",
      name: `${state.auth.user.username}-${userId}`,
      userIds: [userId, currentUserId],
    };
    const newChat = (await thunkAPI.dispatch(
      createChat(newChatData)
    )) as PayloadAction<Chat>;
    thunkAPI.dispatch(setActiveChat(newChat.payload.id));
  }
);
