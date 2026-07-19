import type { Meta, StoryObj } from "@storybook/angular";
import { of, throwError } from "rxjs";
import { componentWrapperDecorator } from "@storybook/angular";
import { SubscribeFormComponent } from "./subscribe-form.component";

const meta: Meta<SubscribeFormComponent> = {
  title: "Components/SubscribeForm",
  component: SubscribeFormComponent,
  tags: ["autodocs"],
  argTypes: {
    mode: { control: "radio", options: ["anon", "auth"] },
  },
  decorators: [
    componentWrapperDecorator(
      (story) => `
        <div style="
          max-width: 480px;
          margin: 48px auto;
          padding: 32px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 16px;
        ">${story}</div>
      `,
    ),
  ],
  render: (args) => ({ props: args }),
};

export default meta;
type Story = StoryObj<SubscribeFormComponent>;

export const Anonymous: Story = {
  name: "Anonymous — email + name form",
  args: {
    mode: "anon",
    subscribeAnon: (email: string, _name: string) => {
      console.log("subscribeAnon called with", email);
      return of(undefined);
    },
  },
};

export const AnonymousError: Story = {
  name: "Anonymous — API error state",
  args: {
    mode: "anon",
    initialState: "error",
    subscribeAnon: () => throwError(() => new Error("Server error")),
  },
};

export const Authenticated: Story = {
  name: "Authenticated — one-click subscribe",
  args: {
    mode: "auth",
    subscribeAuth: () => of(undefined),
    unsubscribeAuth: () => of(undefined),
  },
};

export const AuthenticatedError: Story = {
  name: "Authenticated — API error state",
  args: {
    mode: "auth",
    initialState: "error",
    subscribeAuth: () => throwError(() => new Error("Server error")),
    unsubscribeAuth: () => throwError(() => new Error("Server error")),
  },
};
