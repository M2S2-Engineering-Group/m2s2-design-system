import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';
import { configure } from 'axe-core';

expect.extend(toHaveNoViolations);
configure({ rules: [{ id: 'region', enabled: false }] });
