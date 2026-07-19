import type { Meta, StoryObj } from "@storybook/vue3";
import ProcessSteps from "./ProcessSteps.vue";

const meta: Meta<typeof ProcessSteps> = {
  title: "Components/ProcessSteps",
  component: ProcessSteps,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ProcessSteps>;

export const Default: Story = {
  args: {
    steps: [
      {
        num: "01",
        name: "Discover",
        desc: "Audit your stack, team, and goals to find the highest-leverage gaps.",
      },
      {
        num: "02",
        name: "Design",
        desc: "Architect a solution that fits your constraints and scales with you.",
      },
      {
        num: "03",
        name: "Deliver",
        desc: "Ship incrementally with full visibility and no surprises.",
      },
      {
        num: "04",
        name: "Optimize",
        desc: "Measure outcomes and refine continuously after launch.",
      },
    ],
  },
};

export const ThreeSteps: Story = {
  args: {
    steps: [
      {
        num: "01",
        name: "Scope",
        desc: "Define what success looks like and agree on scope upfront.",
      },
      {
        num: "02",
        name: "Build",
        desc: "Iterative development with weekly demos and tight feedback loops.",
      },
      {
        num: "03",
        name: "Launch",
        desc: "Production deployment with runbooks, monitoring, and handoff docs.",
      },
    ],
  },
};
