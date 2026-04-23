import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, LOCALES, getMessages, isLocale } from "./i18n";

describe("i18n", () => {
  describe("isLocale", () => {
    it("accepts the known locales", () => {
      for (const locale of LOCALES) {
        expect(isLocale(locale)).toBe(true);
      }
    });

    it("rejects unknown values", () => {
      expect(isLocale("de")).toBe(false);
      expect(isLocale("")).toBe(false);
      expect(isLocale(undefined)).toBe(false);
      expect(isLocale(null)).toBe(false);
    });
  });

  describe("getMessages", () => {
    it("returns non-empty landing copy for every locale", () => {
      for (const locale of LOCALES) {
        const m = getMessages(locale);
        expect(m.landing.title.length).toBeGreaterThan(0);
        expect(m.landing.lede.length).toBeGreaterThan(0);
        expect(m.landing.cta.length).toBeGreaterThan(0);
      }
    });

    it("returns non-empty login copy for every locale", () => {
      for (const locale of LOCALES) {
        const m = getMessages(locale);
        expect(m.login.title.length).toBeGreaterThan(0);
        expect(m.login.submit.length).toBeGreaterThan(0);
        expect(m.login.invalid.length).toBeGreaterThan(0);
      }
    });

    it("keeps the rejection rule: no tool-war framing in landing", () => {
      for (const locale of LOCALES) {
        const m = getMessages(locale);
        const text = `${m.landing.title} ${m.landing.lede}`.toLowerCase();
        expect(text).not.toContain("chatgpt");
        expect(text).not.toContain("cursor");
        expect(text).not.toContain("copilot");
      }
    });
  });

  describe("DEFAULT_LOCALE", () => {
    it("is a known locale", () => {
      expect(LOCALES).toContain(DEFAULT_LOCALE);
    });
  });
});
