import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { Chat } from "./Chat";

const noopSend = vi.fn().mockResolvedValue("Hello from AI");

const renderChat = (overrides: Record<string, unknown> = {}) =>
  render(<Chat sendMessage={noopSend} {...overrides} />);

describe("Chat", () => {
  beforeEach(() => {
    noopSend.mockClear();
  });

  describe("open / close toggle", () => {
    it("renders the toggle button and panel is hidden initially", () => {
      renderChat();
      expect(
        screen.getByRole("button", { name: "Open chat" }),
      ).toBeInTheDocument();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("opens the panel when the toggle button is clicked", () => {
      renderChat();
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("closes the panel when the close button is clicked", () => {
      renderChat();
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Close chat" }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("welcome message", () => {
    it("shows the welcome message as the first assistant message when opened with no prior conversation", () => {
      renderChat({ welcomeMessage: "Hi there! How can I help?" });
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
      expect(screen.getByText("Hi there! How can I help?")).toBeInTheDocument();
    });

    it("does not show a welcome message when none is provided", () => {
      renderChat();
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
      expect(
        screen.getByText("Send a message to get started."),
      ).toBeInTheDocument();
    });

    it("does not re-add the welcome message on subsequent opens once a conversation exists", async () => {
      const sendMessage = vi.fn().mockResolvedValue("Reply");
      renderChat({ welcomeMessage: "Hi there!", sendMessage });
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));

      const textarea = screen.getByPlaceholderText("Ask a question...");
      fireEvent.change(textarea, { target: { value: "A question" } });
      fireEvent.click(screen.getByRole("button", { name: "Send" }));
      await waitFor(() => expect(sendMessage).toHaveBeenCalledOnce());

      fireEvent.click(screen.getByRole("button", { name: "Close chat" }));
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
      expect(screen.getAllByText("Hi there!")).toHaveLength(1);
    });
  });

  describe("title and subtitle", () => {
    it("renders the custom title in the panel header", () => {
      renderChat({ title: "My Assistant" });
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
      expect(screen.getByText("My Assistant")).toBeInTheDocument();
    });

    it("renders the subtitle when no messages exist", () => {
      renderChat({ subtitle: "Ask me anything" });
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
      expect(screen.getByText("Ask me anything")).toBeInTheDocument();
    });
  });

  describe("sending messages", () => {
    it("calls sendMessage with the message history on submit via button", async () => {
      const sendMessage = vi.fn().mockResolvedValue("Reply");
      renderChat({ sendMessage });
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));

      const textarea = screen.getByPlaceholderText("Ask a question...");
      fireEvent.change(textarea, { target: { value: "What is CQRS?" } });
      fireEvent.click(screen.getByRole("button", { name: "Send" }));

      await waitFor(() => expect(sendMessage).toHaveBeenCalledOnce());
      const [messages] = sendMessage.mock.calls[0];
      expect(messages).toContainEqual({
        role: "user",
        content: "What is CQRS?",
      });
    });

    it("calls sendMessage when Enter is pressed without Shift", async () => {
      const sendMessage = vi.fn().mockResolvedValue("Reply");
      renderChat({ sendMessage });
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));

      const textarea = screen.getByPlaceholderText("Ask a question...");
      fireEvent.change(textarea, { target: { value: "Hello?" } });
      fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

      await waitFor(() => expect(sendMessage).toHaveBeenCalledOnce());
    });

    it("does not submit on Shift+Enter", () => {
      const sendMessage = vi.fn().mockResolvedValue("Reply");
      renderChat({ sendMessage });
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));

      const textarea = screen.getByPlaceholderText("Ask a question...");
      fireEvent.change(textarea, { target: { value: "Hello?" } });
      fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });

      expect(sendMessage).not.toHaveBeenCalled();
    });

    it("renders the assistant message after sendMessage resolves", async () => {
      const sendMessage = vi
        .fn()
        .mockResolvedValue(
          "CQRS stands for Command Query Responsibility Segregation.",
        );
      renderChat({ sendMessage });
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));

      const textarea = screen.getByPlaceholderText("Ask a question...");
      fireEvent.change(textarea, { target: { value: "What is CQRS?" } });
      fireEvent.click(screen.getByRole("button", { name: "Send" }));

      await waitFor(() =>
        expect(
          screen.getByText(
            "CQRS stands for Command Query Responsibility Segregation.",
          ),
        ).toBeInTheDocument(),
      );
    });
  });

  describe("typing indicator", () => {
    it("shows the typing indicator while awaiting a response", async () => {
      let resolve!: (v: string) => void;
      const sendMessage = vi.fn().mockReturnValue(
        new Promise<string>((r) => {
          resolve = r;
        }),
      );
      renderChat({ sendMessage });
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));

      const textarea = screen.getByPlaceholderText("Ask a question...");
      fireEvent.change(textarea, { target: { value: "Hello?" } });
      fireEvent.click(screen.getByRole("button", { name: "Send" }));

      await waitFor(() =>
        expect(document.querySelector(".chat-typing")).toBeInTheDocument(),
      );

      resolve("Done");
    });

    it("hides the typing indicator after the response arrives", async () => {
      const sendMessage = vi.fn().mockResolvedValue("Done");
      renderChat({ sendMessage });
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));

      const textarea = screen.getByPlaceholderText("Ask a question...");
      fireEvent.change(textarea, { target: { value: "Hello?" } });
      fireEvent.click(screen.getByRole("button", { name: "Send" }));

      await waitFor(() =>
        expect(document.querySelector(".chat-typing")).not.toBeInTheDocument(),
      );
    });
  });

  describe("error state", () => {
    it("shows an error message when sendMessage rejects", async () => {
      const sendMessage = vi.fn().mockRejectedValue(new Error("fail"));
      renderChat({ sendMessage });
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));

      const textarea = screen.getByPlaceholderText("Ask a question...");
      fireEvent.change(textarea, { target: { value: "Will this fail?" } });
      fireEvent.click(screen.getByRole("button", { name: "Send" }));

      await waitFor(() =>
        expect(
          screen.getByText("Something went wrong — please try again."),
        ).toBeInTheDocument(),
      );
    });
  });

  describe("controlled open state", () => {
    it("renders open when the open prop is true, without needing a toggle click", () => {
      renderChat({ open: true });
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("calls onOpenChange instead of only relying on internal state when toggled", () => {
      const onOpenChange = vi.fn();
      renderChat({ open: false, onOpenChange });
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("stays open when the open prop is held true even after a toggle click (fully controlled)", () => {
      const onOpenChange = vi.fn();
      renderChat({ open: true, onOpenChange });
      fireEvent.click(screen.getByRole("button", { name: "Close chat" }));
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("header content", () => {
    it("does not render extra header content when headerContent is not provided", () => {
      renderChat();
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
      expect(
        document.querySelector(".chat-header__extra"),
      ).not.toBeInTheDocument();
    });

    it("renders a plain string as text", () => {
      renderChat({ headerContent: "Now serving two personas" });
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
      expect(screen.getByText("Now serving two personas")).toBeInTheDocument();
    });

    it("renders an element as-is, exactly as provided", () => {
      renderChat({
        headerContent: <button data-testid="custom-tab">Assistant</button>,
      });
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
      expect(screen.getByTestId("custom-tab")).toBeInTheDocument();
      expect(screen.getByTestId("custom-tab")).toHaveTextContent("Assistant");
    });
  });

  describe("accessibility", () => {
    it("has no violations (closed state)", async () => {
      const { container } = renderChat();
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations (open state)", async () => {
      const { container } = renderChat();
      fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
