import { setChats } from "@/features/chats/chatsSlice";
import { Chat } from "@/features/chats/types";
import store from "@/store";
import fireEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "utils/test-utils";
import { ChatList } from "./ChatList";

const updatedAt = new Date("2022-01-01T00:00:00.000Z");
const createdAt = new Date("2022-01-01T00:00:00.000Z");

describe("ChatList component", () => {
  const chats: Chat[] = [
    {
      id: "1",
      name: "Chat 1",
      chat_type: "group",
      users: [],
      messages: [],
      createdAt: "2022-01-01T00:00:00.000Z",
      updatedAt: "2022-01-01T00:00:00.000Z",
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
          createdAt: "2022-01-01T00:00:00.000Z",
        },
        {
          id: "2",
          chatId: "2",
          userId: "2",
          content: "Message 2",
          user: { id: "2", username: "User 2" },
          createdAt: "2022-01-01T00:00:00.000Z",
        },
      ],
      createdAt: "2022-01-01T00:00:00.000Z",
      updatedAt: "2022-01-01T00:00:00.000Z",
    },
  ];

  store.dispatch(setChats(chats));
  test("renders chat items", () => {
    renderWithProviders(<ChatList chats={chats} />);

    const chatItems = screen.getAllByRole("listitem");
    expect(chatItems).toHaveLength(chats.length);
  });

  test("renders chat item with correct name", () => {
    renderWithProviders(<ChatList chats={chats} />);

    const chatItem = screen.getByText("Chat 1");
    expect(chatItem).toBeInTheDocument();
  });

  // active chat should have its name semi-bold
  // active chat should have its background color changed
  test("renders active chat with correct styles", () => {
    renderWithProviders(<ChatList chats={chats} />);
    const chatItem = screen.getByText("Chat 1");
    fireEvent.click(chatItem);
    expect(chatItem).toHaveClass("truncate");
  });
});
