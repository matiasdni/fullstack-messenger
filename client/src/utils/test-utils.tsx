import { DrawerProvider } from "@/contexts/DrawerContext";
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render } from "@testing-library/react";
import authReducer from "features/auth/authSlice";
import chatsReducer from "features/chats/chatsSlice";
import inviteReducer from "features/invites/inviteSlice";
import notificationReducer from "features/notification/notificationSlice";
import usersReducer from "features/users/usersSlice";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { afterEach } from "vitest";
import { ReactElement } from "react";

afterEach(() => {
  cleanup();
});

function customRenderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        auth: authReducer,
        chats: chatsReducer,
        users: usersReducer,
        invites: inviteReducer,
        notifications: notificationReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  return render(ui, {
    ...renderOptions,
    wrapper: ({ children }) => (
      <Provider store={store}>
        <BrowserRouter>
          <DrawerProvider>{children}</DrawerProvider>
        </BrowserRouter>
      </Provider>
    ),
  });
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
export { customRenderWithProviders as renderWithProviders };
