import type { Meta, StoryObj } from "@storybook/vue3";
import BrandConfigurator from "./BrandConfigurator.vue";

const meta: Meta = {
  title: "Brand Configurator",
  component: BrandConfigurator,
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
};

export default meta;

export const Configure: StoryObj = {
  name: "Configure Your Brand",
};
