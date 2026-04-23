import { describe, expect, it } from "vitest";
import { signAuthToken, verifyAuthToken } from "./auth";

const password = "test-password-123";
const secret = "test-secret-abcdef0123456789";

describe("auth", () => {
  describe("signAuthToken", () => {
    it("produces a stable hex digest for the same inputs", async () => {
      const a = await signAuthToken(password, secret);
      const b = await signAuthToken(password, secret);
      expect(a).toBe(b);
      expect(a).toMatch(/^[0-9a-f]{64}$/);
    });

    it("produces different digests for different secrets", async () => {
      const a = await signAuthToken(password, secret);
      const b = await signAuthToken(password, secret + "!");
      expect(a).not.toBe(b);
    });
  });

  describe("verifyAuthToken", () => {
    it("verifies a correctly signed token", async () => {
      const token = await signAuthToken(password, secret);
      expect(await verifyAuthToken(token, password, secret)).toBe(true);
    });

    it("rejects a tampered token", async () => {
      const token = await signAuthToken(password, secret);
      const tampered = token.slice(0, -1) + (token.endsWith("0") ? "1" : "0");
      expect(await verifyAuthToken(tampered, password, secret)).toBe(false);
    });

    it("rejects when any input is missing", async () => {
      const token = await signAuthToken(password, secret);
      expect(await verifyAuthToken(undefined, password, secret)).toBe(false);
      expect(await verifyAuthToken(token, undefined, secret)).toBe(false);
      expect(await verifyAuthToken(token, password, undefined)).toBe(false);
    });

    it("rejects a token signed with a different secret", async () => {
      const token = await signAuthToken(password, secret);
      expect(await verifyAuthToken(token, password, secret + "x")).toBe(false);
    });
  });
});
