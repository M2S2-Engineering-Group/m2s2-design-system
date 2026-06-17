import { describe, it, expect } from 'vitest';
import { validateEmail, EMAIL_REGEX } from './form';

describe('validateEmail', () => {
  it('accepts a standard email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('accepts subdomains', () => {
    expect(validateEmail('user@mail.example.com')).toBe(true);
  });

  it('accepts plus-addressing', () => {
    expect(validateEmail('user+tag@example.com')).toBe(true);
  });

  it('trims whitespace before validating', () => {
    expect(validateEmail('  user@example.com  ')).toBe(true);
  });

  it('rejects missing @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  it('rejects missing domain', () => {
    expect(validateEmail('user@')).toBe(false);
  });

  it('rejects missing TLD', () => {
    expect(validateEmail('user@example')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('rejects whitespace only', () => {
    expect(validateEmail('   ')).toBe(false);
  });
});

describe('EMAIL_REGEX', () => {
  it('is a RegExp', () => {
    expect(EMAIL_REGEX).toBeInstanceOf(RegExp);
  });
});
