// Sole admin allowed into /admin. Hardcoded by user choice.
// Not a secret — emails are not secrets — but kept server-side for clarity.
export const ADMIN_EMAIL = "abdullah.brr12@gmail.com";

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
