import { Invite } from "./types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

const initialState: Invite[] = [];

export const acceptInvite = createAsyncThunk(
  "invites/acceptInvite",
  async (inviteId: string) => {
    // TODO: implement
    return inviteId;
  }
);

export const rejectInvite = createAsyncThunk(
  "invites/rejectInvite",
  async (inviteId: string) => {
    // TODO: implement
    return inviteId;
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
    updateInviteStatus: (
      state,
      action: PayloadAction<{
        inviteId: string;
        status: "pending" | "accepted" | "rejected";
      }>
    ) => {
      const invite = state.find(
        (invite) => invite.id === action.payload.inviteId
      );
      if (invite) {
        invite.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(acceptInvite.fulfilled, (state, action) => {
      console.log(
        "acceptInvite.fulfilled",
        "prev state",
        state,
        "action",
        action
      );
    });
    builder.addCase(rejectInvite.fulfilled, (state, action) => {
      console.log(
        "rejectInvite.fulfilled",
        "prev state",
        state,
        "action",
        action
      );
    });

    builder.addCase(acceptInvite.rejected, (state, action) => {
      // implement when we have error handling in place and we want to show the user a message
      console.log(
        "acceptInvite.rejected",
        "prev state",
        state,
        "action",
        action
      );
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

export const { addInvite, removeInvite, updateInviteStatus } =
  invitesSlice.actions;
export default invitesSlice.reducer;
