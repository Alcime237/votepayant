import { normalizePhoneNumber } from './phone';

describe('normalizePhoneNumber', () => {
  it.each([
    ['771234567', '771234567'],
    ['77 123 45 67', '771234567'],
    ['77-123-45-67', '771234567'],
    ['+221 77 123 45 67', '771234567'],
    ['221771234567', '771234567'],
    ['00221771234567', '771234567'],
  ])('accepte %s', (input, expected) => {
    expect(normalizePhoneNumber(input)).toBe(expected);
  });

  it.each(['', '  ', '12345', '7712345678', 'abc', '77 123 45 6', null, undefined])('refuse %p', (input) => {
    expect(normalizePhoneNumber(input)).toBeNull();
  });
});
