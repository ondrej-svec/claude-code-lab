import { CHAPTERS } from "./chapters";
import { extractToc, getChapterSource, type SearchEntry } from "./content";
import type { Locale } from "./i18n";

export async function buildSearchIndex(locale: Locale): Promise<SearchEntry[]> {
  const entries: SearchEntry[] = [];

  for (const chapter of CHAPTERS) {
    const source = await getChapterSource(locale, chapter.slug);
    if (!source) continue;

    // Top-level chapter entry (points at the chapter page, no anchor).
    entries.push({
      chapterSlug: chapter.slug,
      chapterTitle: chapter.titles[locale],
      chapterOrder: chapter.order,
      heading: null,
      headingId: null,
      level: 1,
    });

    // One entry per h2 / h3 heading inside the chapter.
    const headings = extractToc(source);
    for (const h of headings) {
      entries.push({
        chapterSlug: chapter.slug,
        chapterTitle: chapter.titles[locale],
        chapterOrder: chapter.order,
        heading: h.text,
        headingId: h.id,
        level: h.level,
      });
    }
  }

  return entries;
}
