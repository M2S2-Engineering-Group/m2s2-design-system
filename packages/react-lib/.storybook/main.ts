import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs"],
  staticDirs: [{ from: "../src/assets", to: "/assets" }],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config, { configType }) => {
    if (configType === "PRODUCTION") {
      config.base = "/react/";
    }
    return config;
  },
};

export default config;
