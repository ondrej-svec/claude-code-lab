export const AUTH_COOKIE = "cc-lab-auth";
export const LOCALE_COOKIE = "cc-lab-locale";
export const AUTH_TTL_SECONDS = 60 * 60 * 24 * 30;

export async function signAuthToken(password: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(password),
  );
  return toHex(new Uint8Array(signature));
}

export async function verifyAuthToken(
  token: string | undefined,
  password: string | undefined,
  secret: string | undefined,
): Promise<boolean> {
  if (!token || !password || !secret) return false;
  const expected = await signAuthToken(password, secret);
  return constantTimeEqual(token, expected);
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
