import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  message: string | null;
  status: "success" | "error" | "warning" | "info";
}

const initialState: NotificationState = {
  message: null,
  status: "info",
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<NotificationState>) => {
      state.message = action.payload.message;
      state.status = action.payload.status;
    },
    clearNotification: (state) => {
      state.message = null;
      state.status = "info";
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
