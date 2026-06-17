import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatBlogDate, todayAsIsoDate, generateSlug, calcReadingTime } from './blog';

describe('formatBlogDate', () => {
  it('formats an ISO date string as long US date', () => {
    expect(formatBlogDate('2026-06-16')).toBe('June 16, 2026');
  });

  it('formats January correctly', () => {
    expect(formatBlogDate('2025-01-01')).toBe('January 1, 2025');
  });

  it('handles end-of-month dates', () => {
    expect(formatBlogDate('2024-02-29')).toBe('February 29, 2024');
  });
});

describe('todayAsIsoDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-16T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns today as YYYY-MM-DD', () => {
    expect(todayAsIsoDate()).toBe('2026-06-16');
  });

  it('contains no time component', () => {
    expect(todayAsIsoDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('generateSlug', () => {
  it('lowercases the title', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(generateSlug('my blog post')).toBe('my-blog-post');
  });

  it('removes special characters', () => {
    expect(generateSlug('Hello, World!')).toBe('hello-world');
  });

  it('collapses multiple spaces', () => {
    expect(generateSlug('hello   world')).toBe('hello-world');
  });

  it('collapses multiple hyphens', () => {
    expect(generateSlug('hello--world')).toBe('hello-world');
  });

  it('trims leading and trailing whitespace', () => {
    expect(generateSlug('  hello world  ')).toBe('hello-world');
  });

  it('handles apostrophes and quotes', () => {
    expect(generateSlug("What's New in Go 1.21")).toBe('whats-new-in-go-121');
  });

  it('preserves existing hyphens', () => {
    expect(generateSlug('server-side rendering')).toBe('server-side-rendering');
  });

  it('handles an empty string', () => {
    expect(generateSlug('')).toBe('');
  });
});

describe('calcReadingTime', () => {
  it('returns 1 for empty content', () => {
    expect(calcReadingTime('')).toBe(1);
  });

  it('returns 1 for very short content', () => {
    expect(calcReadingTime('Hello world')).toBe(1);
  });

  it('calculates 1 minute for exactly 200 words', () => {
    const content = Array(200).fill('word').join(' ');
    expect(calcReadingTime(content)).toBe(1);
  });

  it('calculates 2 minutes for 201 words', () => {
    const content = Array(201).fill('word').join(' ');
    expect(calcReadingTime(content)).toBe(2);
  });

  it('calculates 5 minutes for 1000 words', () => {
    const content = Array(1000).fill('word').join(' ');
    expect(calcReadingTime(content)).toBe(5);
  });

  it('ignores leading/trailing whitespace', () => {
    const content = '  ' + Array(200).fill('word').join(' ') + '  ';
    expect(calcReadingTime(content)).toBe(1);
  });
});
