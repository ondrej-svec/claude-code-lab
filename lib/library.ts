import { promises as fs } from "node:fs";
import path from "node:path";
import type { Locale } from "./i18n";
import { CHAPTERS, type Chapter } from "./chapters";

export type LibraryEntryFrontmatter = {
  slug: string;
  title: string;
  chapter: string;
  tags: string[];
  readTime: string;
};

export type LibraryEntry = LibraryEntryFrontmatter & {
  source: string;
  affinity: Chapter | null;
};

// The library is hand-curated. Slugs are listed here; the MDX file is
// the source of truth for everything else (title, chapter affinity,
// tags, read time). One source of truth per entry.
export const LIBRARY_SLUGS: readonly string[] = [
  "context-engineering",
  "autonomous-loops",
  "cc-lab-diagnose",
] as const;

export type LibraryEntrySummary = LibraryEntryFrontmatter & {
  affinity: Chapter | null;
  snippet: string;
};

// Reads every library entry's frontmatter + a short snippet of its
// opening prose. Used by the library index. Skips entries that are
// missing in the requested locale (e.g. EN-only ships during the
// initial lift).
export async function getAllLibraryEntries(
  locale: Locale,
): Promise<LibraryEntrySummary[]> {
  const summaries = await Promise.all(
    LIBRARY_SLUGS.map(async (slug) => {
      const entry = await getLibraryEntry(locale, slug);
      if (!entry) return null;
      return {
        slug: entry.slug,
        title: entry.title,
        chapter: entry.chapter,
        tags: entry.tags,
        readTime: entry.readTime,
        affinity: entry.affinity,
        snippet: extractFirstParagraph(entry.source),
      } satisfies LibraryEntrySummary;
    }),
  );
  return summaries.filter((e): e is LibraryEntrySummary => e !== null);
}

// Library entries that target a given spine chapter. Used by the
// chapter page's "Go deeper" surface.
export async function getLibraryEntriesForChapter(
  locale: Locale,
  chapterSlug: string,
): Promise<LibraryEntrySummary[]> {
  const all = await getAllLibraryEntries(locale);
  return all.filter((entry) => entry.chapter === chapterSlug);
}

function extractFirstParagraph(source: string): string {
  // Skip leading blank lines, the H1, and any blank lines after it.
  // The first non-empty paragraph after the H1 is the snippet.
  const lines = source.split("\n");
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;
  if (i < lines.length && lines[i].startsWith("# ")) i++;
  while (i < lines.length && lines[i].trim() === "") i++;
  const buf: string[] = [];
  while (i < lines.length && lines[i].trim() !== "") {
    buf.push(lines[i]);
    i++;
  }
  return buf
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getLibraryEntry(
  locale: Locale,
  slug: string,
): Promise<LibraryEntry | null> {
  const filepath = path.join(
    process.cwd(),
    "content",
    locale,
    "library",
    `${slug}.mdx`,
  );
  let raw: string;
  try {
    raw = await fs.readFile(filepath, "utf-8");
  } catch {
    return null;
  }

  const frontmatter = parseFrontmatter(raw);
  if (!frontmatter) return null;

  const source = stripFrontmatter(raw);
  const affinity = CHAPTERS.find((c) => c.slug === frontmatter.chapter) ?? null;

  return { ...frontmatter, source, affinity };
}

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?/;

function parseFrontmatter(raw: string): LibraryEntryFrontmatter | null {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return null;

  const fields: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    if (!m) continue;
    fields[m[1]] = m[2].trim();
  }

  const tagsRaw = fields.tags ?? "[]";
  const tags = tagsRaw
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!fields.slug || !fields.title || !fields.chapter || !fields.readTime) {
    return null;
  }

  return {
    slug: fields.slug,
    title: fields.title,
    chapter: fields.chapter,
    tags,
    readTime: fields.readTime,
  };
}

function stripFrontmatter(raw: string): string {
  return raw.replace(FRONTMATTER_RE, "");
}
