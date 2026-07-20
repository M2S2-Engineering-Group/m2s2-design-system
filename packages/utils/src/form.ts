export const EMAIL_REGEX = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

/** Returns true if the email string passes basic format validation. */
export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}
