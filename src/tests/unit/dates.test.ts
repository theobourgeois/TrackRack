import { getDateString } from '@/utils/date-utils';
import '@testing-library/jest-dom'

describe('getDateString', () => {
  const now = new Date();

  test('returns "Just now" for dates less than a minute ago', () => {
    const date = new Date(now.getTime() - 30 * 1000);
    expect(getDateString(date)).toBe('Just now');
  });

  test('returns "1 minute ago" for dates a minute ago', () => {
    const date = new Date(now.getTime() - 60 * 1000);
    expect(getDateString(date)).toBe('1 minute ago');
  });

  test('returns "1 hour ago" for dates an hour ago', () => {
    const date = new Date(now.getTime() - 60 * 60 * 1000);
    expect(getDateString(date)).toBe('1 hour ago');
  });

  test('returns "1 day ago" for dates a day ago', () => {
    const date = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    expect(getDateString(date)).toBe('1 day ago');
  });

  test('returns "1 week ago" for dates a week ago', () => {
    const date = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 week ago
    expect(getDateString(date)).toBe('1 week ago');
  });

  test('returns "1 month ago" for dates a month ago', () => {
    const date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    expect(getDateString(date)).toBe('1 month ago');
  });

  test('returns "1 year ago" for dates a year ago', () => {
    const date = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    expect(getDateString(date)).toBe('1 year ago');
  });

  test('respects the precision parameter', () => {
    const date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    expect(getDateString(date, 'day')).toBe('30 days ago');
  });

  test('respects the clamp parameter', () => {
    const date = new Date(now.getTime() - 30 * 60 * 1000);
    expect(getDateString(date, 'minute', 'hour')).toBe('Less than an hour ago');
  });
});