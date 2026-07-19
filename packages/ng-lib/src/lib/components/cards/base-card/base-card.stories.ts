import type { Meta, StoryObj } from "@storybook/angular";
import { BaseCardComponent } from "./base-card.component";

const meta: Meta<BaseCardComponent> = {
  title: "Cards/BaseCard",
  component: BaseCardComponent,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "raised", "accent"],
    },
    featured: { control: "boolean" },
  },
  render: (args) => ({
    props: args,
    template: `
      <m2s2-card [featured]="featured" [variant]="variant" style="max-width:360px">
        <h3 style="margin:0;font-size:1.1rem">Card Title</h3>
        <p style="margin:0;color:var(--color-on-surface-muted)">
          This is the projected content slot. Any markup can go here.
        </p>
      </m2s2-card>
    `,
  }),
};
export default meta;
type Story = StoryObj<BaseCardComponent>;

export const Default: Story = {
  args: { variant: "default", featured: false },
};

export const Raised: Story = {
  args: { variant: "raised", featured: false },
};

export const Accent: Story = {
  args: { variant: "accent", featured: false },
};

export const Featured: Story = {
  args: { variant: "default", featured: true },
};
