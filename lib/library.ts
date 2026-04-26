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
export const LIBRARY_SLUGS: readonly string[] = ["context-engineering"] as const;

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
