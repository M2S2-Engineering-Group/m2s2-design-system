import type { Meta, StoryObj } from "@storybook/angular";
import { FooterComponent } from "./footer.component";

const meta: Meta<FooterComponent> = {
  title: "Components/Footer",
  component: FooterComponent,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  render: (args) => ({
    props: args,
    template: `<m2s2-footer [config]="config" />`,
  }),
};

export default meta;
type Story = StoryObj<FooterComponent>;

export const Default: Story = {
  args: {
    config: {
      brandName: "M²S² Engineering Group",
      links: [
        {
          type: "linkedin",
          href: "https://www.linkedin.com/company/m2s2-engineering-group",
          label: "LinkedIn",
        },
        {
          type: "twitter",
          href: "https://x.com/M2S2Engineering",
          label: "X (Twitter)",
        },
        {
          type: "github",
          href: "https://github.com/mgmaster24",
          label: "GitHub",
        },
        { type: "email", href: "mailto:hello@m2s2.io", label: "Email" },
      ],
    },
  },
};

export const EmailOnly: Story = {
  name: "Email Only",
  args: {
    config: {
      brandName: "Acme Corp",
      links: [{ type: "email", href: "mailto:hello@acme.com", label: "Email" }],
    },
  },
};

export const CustomBrand: Story = {
  name: "Custom Brand",
  args: {
    config: {
      brandName: "Your Company Name",
      links: [
        { type: "linkedin", href: "#", label: "LinkedIn" },
        { type: "github", href: "#", label: "GitHub" },
        { type: "twitter", href: "#", label: "Twitter" },
        { type: "email", href: "#", label: "Email" },
      ],
    },
  },
};

export const WithVersion: Story = {
  name: "With Version",
  args: {
    config: {
      brandName: "M²S² Engineering Group",
      links: [
        {
          type: "github",
          href: "https://github.com/mgmaster24",
          label: "GitHub",
        },
        { type: "email", href: "mailto:hello@m2s2.io", label: "Email" },
      ],
      buildVersion: "2.9.1+8f3a1c9",
    },
  },
};
