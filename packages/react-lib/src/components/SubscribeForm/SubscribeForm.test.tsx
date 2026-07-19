import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { axe } from "jest-axe";
import { SubscribeForm } from "./SubscribeForm";

describe("SubscribeForm — anon mode", () => {
  it("renders email and name inputs", () => {
    render(<SubscribeForm />);
    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Your name (optional)"),
    ).toBeInTheDocument();
  });

  it("renders a disabled subscribe button when email is empty", () => {
    render(<SubscribeForm />);
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeDisabled();
  });

  it("enables the button when a valid email is entered", async () => {
    const user = userEvent.setup();
    render(<SubscribeForm />);
    await user.type(
      screen.getByPlaceholderText("your@email.com"),
      "test@example.com",
    );
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeEnabled();
  });

  it("keeps the button disabled for an invalid email", async () => {
    const user = userEvent.setup();
    render(<SubscribeForm />);
    await user.type(
      screen.getByPlaceholderText("your@email.com"),
      "not-an-email",
    );
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeDisabled();
  });

  it("calls subscribeAnon with trimmed email and name on submit", async () => {
    const subscribeAnon = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<SubscribeForm subscribeAnon={subscribeAnon} />);
    await user.type(
      screen.getByPlaceholderText("Your name (optional)"),
      "Jane",
    );
    await user.type(
      screen.getByPlaceholderText("your@email.com"),
      "jane@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    await waitFor(() =>
      expect(subscribeAnon).toHaveBeenCalledWith("jane@example.com", "Jane"),
    );
  });

  it("shows a success message after a successful submit", async () => {
    const subscribeAnon = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<SubscribeForm subscribeAnon={subscribeAnon} />);
    await user.type(
      screen.getByPlaceholderText("your@email.com"),
      "test@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    await waitFor(() =>
      expect(screen.getByText(/check your email/i)).toBeInTheDocument(),
    );
  });

  it("shows an error message when subscribeAnon rejects", async () => {
    const subscribeAnon = vi.fn().mockRejectedValue(new Error("Network error"));
    const user = userEvent.setup();
    render(<SubscribeForm subscribeAnon={subscribeAnon} />);
    await user.type(
      screen.getByPlaceholderText("your@email.com"),
      "test@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument(),
    );
  });

  describe("accessibility", () => {
    it("has no violations (default anon form)", async () => {
      const { container } = render(<SubscribeForm />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

describe("SubscribeForm — auth mode", () => {
  it("renders a subscribe button", () => {
    render(<SubscribeForm mode="auth" />);
    expect(
      screen.getByRole("button", { name: /subscribe to blog updates/i }),
    ).toBeInTheDocument();
  });

  it("does not render email or name inputs", () => {
    render(<SubscribeForm mode="auth" />);
    expect(
      screen.queryByPlaceholderText("your@email.com"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("Your name (optional)"),
    ).not.toBeInTheDocument();
  });

  it("calls subscribeAuth when subscribe is clicked", async () => {
    const subscribeAuth = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<SubscribeForm mode="auth" subscribeAuth={subscribeAuth} />);
    await user.click(
      screen.getByRole("button", { name: /subscribe to blog updates/i }),
    );
    await waitFor(() => expect(subscribeAuth).toHaveBeenCalledTimes(1));
  });

  it("shows subscribed state after successful subscribe", async () => {
    const subscribeAuth = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<SubscribeForm mode="auth" subscribeAuth={subscribeAuth} />);
    await user.click(
      screen.getByRole("button", { name: /subscribe to blog updates/i }),
    );
    await waitFor(() =>
      expect(
        screen.getByText(/subscribed to blog updates/i),
      ).toBeInTheDocument(),
    );
  });

  it("shows an unsubscribe button after subscribing", async () => {
    const subscribeAuth = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<SubscribeForm mode="auth" subscribeAuth={subscribeAuth} />);
    await user.click(
      screen.getByRole("button", { name: /subscribe to blog updates/i }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /unsubscribe/i }),
      ).toBeInTheDocument(),
    );
  });

  it("calls unsubscribeAuth when unsubscribe is clicked", async () => {
    const subscribeAuth = vi.fn().mockResolvedValue(undefined);
    const unsubscribeAuth = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(
      <SubscribeForm
        mode="auth"
        subscribeAuth={subscribeAuth}
        unsubscribeAuth={unsubscribeAuth}
      />,
    );
    await user.click(
      screen.getByRole("button", { name: /subscribe to blog updates/i }),
    );
    await waitFor(() => screen.getByRole("button", { name: /unsubscribe/i }));
    await user.click(screen.getByRole("button", { name: /unsubscribe/i }));
    await waitFor(() => expect(unsubscribeAuth).toHaveBeenCalledTimes(1));
  });

  it("shows an error message when subscribeAuth rejects", async () => {
    const subscribeAuth = vi.fn().mockRejectedValue(new Error("fail"));
    const user = userEvent.setup();
    render(<SubscribeForm mode="auth" subscribeAuth={subscribeAuth} />);
    await user.click(
      screen.getByRole("button", { name: /subscribe to blog updates/i }),
    );
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument(),
    );
  });

  describe("accessibility", () => {
    it("has no violations (auth form)", async () => {
      const { container } = render(<SubscribeForm mode="auth" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
