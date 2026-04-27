import type { Locale } from "./i18n";

export type Chapter = {
  slug: string;
  order: number;
  titles: Record<Locale, string>;
  eyebrows: Record<Locale, string>;
  readTime: Record<Locale, string>;
  heroImage?: string;
};

export const CHAPTERS: readonly Chapter[] = [
  {
    slug: "before-we-start",
    order: 1,
    titles: { en: "Before we start", cs: "Než začneme" },
    eyebrows: { en: "Chapter 1 · Orientation", cs: "Kapitola 1 · Orientace" },
    readTime: { en: "5 min read", cs: "5 min čtení" },
    heroImage: "/chapters/01-before-we-start.png",
  },
  {
    slug: "first-task",
    order: 2,
    titles: { en: "Your first task", cs: "První úkol" },
    eyebrows: { en: "Chapter 2 · First contact", cs: "Kapitola 2 · První kontakt" },
    readTime: { en: "10 min read", cs: "10 min čtení" },
    heroImage: "/chapters/02-first-task.png",
  },
  {
    slug: "teach-claude-your-project",
    order: 3,
    titles: {
      en: "Teach Claude your project",
      cs: "Předej Claudovi kontext projektu",
    },
    eyebrows: { en: "Chapter 3 · Context", cs: "Kapitola 3 · Kontext" },
    readTime: { en: "8 min read", cs: "8 min čtení" },
    heroImage: "/chapters/03-teach-claude-your-project.png",
  },
  {
    slug: "iteration-and-control",
    order: 4,
    titles: {
      en: "Iteration and control",
      cs: "Iterace a kontrola",
    },
    eyebrows: { en: "Chapter 4 · Craft", cs: "Kapitola 4 · Řemeslo" },
    readTime: { en: "7 min read", cs: "7 min čtení" },
    heroImage: "/chapters/04-iteration-and-control.png",
  },
  {
    slug: "voice-and-interaction",
    order: 5,
    titles: {
      en: "Voice and modalities",
      cs: "Hlas a modality",
    },
    eyebrows: { en: "Chapter 5 · Modalities", cs: "Kapitola 5 · Modality" },
    readTime: { en: "8 min read", cs: "8 min čtení" },
    heroImage: "/chapters/05-voice-and-interaction.png",
  },
  {
    slug: "ecosystem",
    order: 6,
    titles: { en: "The ecosystem", cs: "Ekosystém" },
    eyebrows: { en: "Chapter 6 · Tour", cs: "Kapitola 6 · Rozhlídnutí" },
    readTime: { en: "12 min read", cs: "12 min čtení" },
    heroImage: "/chapters/06-ecosystem.png",
  },
  {
    slug: "compound-engineering",
    order: 7,
    titles: {
      en: "Compound engineering",
      cs: "Compound engineering",
    },
    eyebrows: { en: "Chapter 7 · Reuse", cs: "Kapitola 7 · Znovupoužití" },
    readTime: { en: "10 min read", cs: "10 min čtení" },
    heroImage: "/chapters/07-compound-engineering.png",
  },
  {
    slug: "next-steps",
    order: 8,
    titles: { en: "Where to go next", cs: "Kam dál" },
    eyebrows: { en: "Chapter 8 · Beyond the lab", cs: "Kapitola 8 · Za hranicí labu" },
    readTime: { en: "6 min read", cs: "6 min čtení" },
    heroImage: "/chapters/08-next-steps.png",
  },
  {
    slug: "reference",
    order: 9,
    titles: { en: "Reference", cs: "Reference" },
    eyebrows: { en: "Chapter 9 · Bookmark this", cs: "Kapitola 9 · Ulož si to" },
    readTime: { en: "Lookup page", cs: "Pro rychlý přehled" },
    heroImage: "/chapters/09-reference.png",
  },
  {
    slug: "behind-the-scenes",
    order: 10,
    titles: { en: "Behind the scenes", cs: "Za oponou" },
    eyebrows: {
      en: "Chapter 10 · Meta",
      cs: "Kapitola 10 · Meta",
    },
    readTime: { en: "4 min read", cs: "4 min čtení" },
    heroImage: "/chapters/10-behind-the-scenes.png",
  },
] as const;

export function getChapter(slug: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

export function getNextChapter(slug: string): Chapter | undefined {
  const current = getChapter(slug);
  if (!current) return undefined;
  return CHAPTERS.find((c) => c.order === current.order + 1);
}

export function getPreviousChapter(slug: string): Chapter | undefined {
  const current = getChapter(slug);
  if (!current) return undefined;
  return CHAPTERS.find((c) => c.order === current.order - 1);
}
