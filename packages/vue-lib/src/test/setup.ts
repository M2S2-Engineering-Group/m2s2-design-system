import "@testing-library/jest-dom";
import { expect, vi } from "vitest";

// configureAxe binds to jest-axe's own internal axe-core instance directly,
// avoiding reliance on a shared/hoisted axe-core module (which npm may or
// may not dedupe with jest-axe's pinned copy depending on npm version).
const { axe, toHaveNoViolations } = vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const jestAxe = require("jest-axe");
  const axe = jestAxe.configureAxe({ rules: { region: { enabled: false } } });
  return { axe, toHaveNoViolations: jestAxe.toHaveNoViolations };
});

vi.mock("jest-axe", () => ({
  axe,
  toHaveNoViolations,
  configureAxe: () => axe,
}));

expect.extend(toHaveNoViolations);
