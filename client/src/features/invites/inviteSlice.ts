import {
  createAsyncThunk,
  createSlice,
  Dispatch,
  PayloadAction,
} from "@reduxjs/toolkit";
import { deleteInvite, updateInvite } from "services/inviteService";
import { fetchUserRequests } from "services/userService";
import { RootState } from "types";
import { InviteAttributes } from "../../../../shared/types";
import { Invite } from "./types";

const initialState: Invite[] = [];

export const updateInviteStatus = createAsyncThunk<
  InviteAttributes,
  Invite,
  {
    state: RootState;
    dispatch: Dispatch<PayloadAction<Invite>>;
  }
>(
  "invites/updateInviteStatus",
  async (invite: Invite): Promise<InviteAttributes> => {
    return await updateInvite(invite);
  }
);

export const rejectInvite = createAsyncThunk(
  "invites/rejectInvite",
  async (invite: Invite) => {
    return await deleteInvite(invite);
  }
);

export const getInvites = createAsyncThunk(
  "invites/getInvites",
  async (userId: string) => {
    return await fetchUserRequests(userId);
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
      console.log(
        "builder.addCase(updateInviteStatus.fulfilled)",
        action.payload
      );
      const inviteIndex = state.findIndex(
        (invite) => invite.id === action.payload.id
      );
      console.log("inviteIndex", inviteIndex);
      if (inviteIndex !== -1) {
        state[inviteIndex] = {
          ...state[inviteIndex],
          status: action.payload.status,
        };
      }
    });

    builder.addCase(updateInviteStatus.rejected, (state, action) => {
      // implement when we have error handling in place, and we want to show the user a message
      console.log(
        "acceptInvite.rejected",
        "prev state",
        state,
        "action",
        action
      );
    });

    builder.addCase(getInvites.fulfilled, (state, action) => {
      const data = action.payload.invites;
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
      // implement when we have error handling in place, and we want to show the user a message
      console.log("getInvites.rejected", "prev state", state, "action", action);
    });

    builder.addCase(rejectInvite.fulfilled, (state, action) => {
      const inviteId = action.payload;
      return state.filter((invite) => invite.id !== inviteId);
    });

    builder.addCase(rejectInvite.rejected, (state, action) => {
      // implement when we have error handling in place, and we want to show the user a message
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
