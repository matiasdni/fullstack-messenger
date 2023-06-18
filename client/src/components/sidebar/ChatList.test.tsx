import { Chat } from "@/features/chats/types";
import store from "@/store";
import { fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { render } from "../../test/setup";
import { ChatList } from "./ChatList";

describe("ChatList component", () => {
  const chats: Chat[] = [
    {
      id: "1",
      name: "Chat 1",
      chat_type: "group",
      users: [],
      messages: [],
      createdAt: new Date("2022-01-01T00:00:00.000Z"),
      updatedAt: new Date("2022-01-01T00:00:00.000Z"),
    },
    {
      id: "2",
      name: "Chat 2",
      chat_type: "private",
      users: [
        { id: "1", username: "User 1" },
        { id: "2", username: "User 2" },
      ],
      messages: [
        {
          id: "1",
          chatId: "2",
          userId: "1",
          content: "Message 1",
          user: { id: "1", username: "User 1" },
          createdAt: new Date("2022-01-01T00:00:00.000Z").toString(),
        },
        {
          id: "2",
          chatId: "2",
          userId: "2",
          content: "Message 2",
          user: { id: "2", username: "User 2" },
          createdAt: new Date("2022-05-01T00:00:00.000Z").toString(),
        },
      ],
      createdAt: new Date("2022-01-01T00:00:00.000Z"),
      updatedAt: new Date("2022-01-01T00:00:00.000Z"),
    },
  ];

  store.dispatch({ type: "chats/setChats", payload: chats });

  test("renders chat items", () => {
    render(
      <Provider store={store}>
        <ChatList chats={chats} />
      </Provider>
    );

    const chatItems = screen.getAllByRole("listitem");
    expect(chatItems).toHaveLength(chats.length);
  });

  test("renders chat item with correct name", () => {
    render(
      <Provider store={store}>
        <ChatList chats={chats} />
      </Provider>
    );

    const chatItem = screen.getByText("Chat 1");
    expect(chatItem).toBeInTheDocument();
  });

  // active chat should have its name semi-bold
  // active chat should have its background color changed
  test("renders active chat with correct styles", () => {
    render(
      <Provider store={store}>
        <ChatList chats={chats} />
      </Provider>
    );

    const activeChat = screen.getByText("Chat 1");
    fireEvent.click(activeChat);
    expect(activeChat).toHaveClass("font-semibold truncate");
  });
});
