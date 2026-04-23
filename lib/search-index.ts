import { CHAPTERS } from "./chapters";
import {
  extractSections,
  getChapterSource,
  type SearchEntry,
} from "./content";
import type { Locale } from "./i18n";

export async function buildSearchIndex(locale: Locale): Promise<SearchEntry[]> {
  const entries: SearchEntry[] = [];

  for (const chapter of CHAPTERS) {
    const source = await getChapterSource(locale, chapter.slug);
    if (!source) continue;

    // Top-level chapter entry (no anchor, routes to the chapter page).
    entries.push({
      chapterSlug: chapter.slug,
      chapterTitle: chapter.titles[locale],
      chapterOrder: chapter.order,
      heading: null,
      headingId: null,
      level: 1,
      snippet: extractLede(source),
    });

    // One entry per h2 / h3 section inside the chapter, with snippet.
    for (const section of extractSections(source)) {
      entries.push({
        chapterSlug: chapter.slug,
        chapterTitle: chapter.titles[locale],
        chapterOrder: chapter.order,
        heading: section.text,
        headingId: section.id,
        level: section.level,
        snippet: section.snippet || null,
      });
    }
  }

  return entries;
}

// Take the first paragraph under the chapter title (# heading) as the lede.
function extractLede(source: string): string | null {
  const lines = source.split("\n");
  let pastH1 = false;
  const buffer: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!pastH1) {
      if (line.startsWith("# ")) pastH1 = true;
      continue;
    }
    // Stop at the next heading.
    if (line.startsWith("## ") || line.startsWith("### ")) break;
    // Skip empty lines before we've captured content; break after.
    if (!line) {
      if (buffer.length === 0) continue;
      break;
    }
    buffer.push(line);
  }

  if (buffer.length === 0) return null;
  return buffer
    .join(" ")
    .replace(/\s+/g, " ")
    .replace(/[*`]/g, "")
    .trim()
    .slice(0, 200);
}
