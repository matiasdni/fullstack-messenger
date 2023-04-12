import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Message } from "../components/Message";

describe("Message", () => {
  test("renders the message content", () => {
    const testContent = "Test message content";
    render(<Message content={testContent} />);

    const messageElement = screen.getByText(testContent);
    expect(messageElement).toBeInTheDocument();
  });
});
