import { fetchUserRequests } from "src/services/user";
import { Invite } from "./types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/types";
import { deleteInvite, updateInvite } from "src/services/invite";
import { InviteAttributes } from "../../../../shared/types";

const initialState: Invite[] = [];

export const updateInviteStatus = createAsyncThunk(
  "invites/updateInviteStatus",
  async (invite: Invite, { getState }) => {
    const token = (getState() as RootState).auth.token;
    return await updateInvite(invite, token);
  }
);

export const rejectInvite = createAsyncThunk(
  "invites/rejectInvite",
  async (invite: Invite, { getState }) => {
    const token = (getState() as RootState).auth.token;
    return await deleteInvite(invite, token);
  }
);

export const getInvites = createAsyncThunk(
  "invites/getInvites",
  async (userId: string, { getState }) => {
    const token = (getState() as RootState).auth.token;
    const data = await fetchUserRequests(userId, token);
    return data;
  }
);

const invitesSlice = createSlice({
  name: "invites",
  initialState,
  reducers: {
    addInvite: (state, action: PayloadAction<Invite>) => {
      state.push(action.payload);
    },
    removeInvite: (state, action: PayloadAction<string>) => {
      return state.filter((invite) => invite.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateInviteStatus.fulfilled, (state, action) => {
      console.log(action.payload);
      const updateInvite: InviteAttributes = action.payload;
      const inviteIndex = state.findIndex(
        (invite) => invite.id === updateInvite.id
      );
      if (inviteIndex !== -1) {
        state[inviteIndex] = {
          ...state[inviteIndex],
          status: updateInvite.status,
        };
      }
      console.log("acceptInvite.fulfilled after", state);
    });

    builder.addCase(updateInviteStatus.rejected, (state, action) => {
      // implement when we have error handling in place and we want to show the user a message
      console.log(
        "acceptInvite.rejected",
        "prev state",
        state,
        "action",
        action
      );
    });

    builder.addCase(getInvites.fulfilled, (state, action) => {
      const data = action.payload;
      const invites: Invite[] = data.invites.map((invite) => ({
        id: invite.id,
        createdAt: invite.createdAt,
        sender: data.senders[invite.senderId],
        chat: data.chats[invite.chatId],
        status: invite.status,
      }));

      return invites;
    });

    builder.addCase(getInvites.rejected, (state, action) => {
      // implement when we have error handling in place and we want to show the user a message
      console.log("getInvites.rejected", "prev state", state, "action", action);
    });

    builder.addCase(rejectInvite.fulfilled, (state, action) => {
      const inviteId = action.payload;
      return state.filter((invite) => invite.id !== inviteId);
    });

    builder.addCase(rejectInvite.rejected, (state, action) => {
      // implement when we have error handling in place and we want to show the user a message
      console.log(
        "rejectInvite.rejected",
        "prev state",
        state,
        "action",
        action
      );
    });
  },
});

export const { addInvite, removeInvite } = invitesSlice.actions;
export const selectInvites = (state: RootState) => state.invites;
export default invitesSlice.reducer;
