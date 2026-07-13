import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// configureAxe binds to jest-axe's own internal axe-core instance directly,
// avoiding reliance on a shared/hoisted axe-core module (which npm may or
// may not dedupe with jest-axe's pinned copy depending on npm version).
jest.mock('jest-axe', () => {
  const actual = jest.requireActual('jest-axe');
  const axe = actual.configureAxe({ rules: { region: { enabled: false } } });
  return { ...actual, axe };
});
