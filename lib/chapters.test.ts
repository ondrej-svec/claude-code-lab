import { describe, expect, it } from "vitest";
import {
  CHAPTERS,
  getChapter,
  getNextChapter,
  getPreviousChapter,
} from "./chapters";
import { LOCALES } from "./i18n";

describe("chapters", () => {
  it("has exactly 8 chapters ordered 1-8", () => {
    expect(CHAPTERS).toHaveLength(8);
    const orders = CHAPTERS.map((c) => c.order);
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("has unique slugs", () => {
    const slugs = CHAPTERS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has titles for every locale on every chapter", () => {
    for (const chapter of CHAPTERS) {
      for (const locale of LOCALES) {
        expect(chapter.titles[locale]).toBeTruthy();
        expect(chapter.eyebrows[locale]).toBeTruthy();
        expect(chapter.readTime[locale]).toBeTruthy();
      }
    }
  });

  describe("getChapter", () => {
    it("returns the chapter for a valid slug", () => {
      const c = getChapter("before-we-start");
      expect(c?.order).toBe(1);
    });

    it("returns undefined for an unknown slug", () => {
      expect(getChapter("does-not-exist")).toBeUndefined();
    });
  });

  describe("getNextChapter", () => {
    it("returns chapter 2 after chapter 1", () => {
      expect(getNextChapter("before-we-start")?.order).toBe(2);
    });

    it("returns undefined after the last chapter", () => {
      expect(getNextChapter("reference")).toBeUndefined();
    });
  });

  describe("getPreviousChapter", () => {
    it("returns chapter 1 before chapter 2", () => {
      expect(getPreviousChapter("first-task")?.order).toBe(1);
    });

    it("returns undefined before the first chapter", () => {
      expect(getPreviousChapter("before-we-start")).toBeUndefined();
    });
  });
});
