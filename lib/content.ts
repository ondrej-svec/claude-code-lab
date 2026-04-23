import { promises as fs } from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type { Locale } from "./i18n";

export async function getChapterSource(
  locale: Locale,
  slug: string,
): Promise<string | null> {
  const filepath = path.join(process.cwd(), "content", locale, `${slug}.mdx`);
  try {
    return await fs.readFile(filepath, "utf-8");
  } catch {
    return null;
  }
}

export type TocHeading = {
  level: 2 | 3;
  text: string;
  id: string;
};

// Extract h2 + h3 headings from MDX source. Uses github-slugger which
// matches rehype-slug's id generation, so generated ids align with the
// ones rehype-slug applies at render time.
export function extractToc(source: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];
  let inFencedBlock = false;

  for (const rawLine of source.split("\n")) {
    const line = rawLine.trimEnd();

    if (line.startsWith("```")) {
      inFencedBlock = !inFencedBlock;
      continue;
    }
    if (inFencedBlock) continue;

    const m2 = line.match(/^## (.+)$/);
    if (m2) {
      const text = cleanHeading(m2[1]);
      headings.push({ level: 2, text, id: slugger.slug(text) });
      continue;
    }
    const m3 = line.match(/^### (.+)$/);
    if (m3) {
      const text = cleanHeading(m3[1]);
      headings.push({ level: 3, text, id: slugger.slug(text) });
    }
  }

  return headings;
}

function cleanHeading(text: string): string {
  // Strip markdown inline formatting for the TOC label while keeping
  // the slugger's input aligned with the rendered heading text.
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

export type SearchEntry = {
  chapterSlug: string;
  chapterTitle: string;
  chapterOrder: number;
  heading: string | null;
  headingId: string | null;
  level: 1 | 2 | 3;
  snippet: string | null;
};

export type Section = {
  level: 2 | 3;
  text: string;
  id: string;
  snippet: string;
};

// Extract sections — headings plus a short body snippet per heading.
// Used by the search index; the TOC sidebar only needs extractToc.
export function extractSections(source: string): Section[] {
  const slugger = new GithubSlugger();
  const sections: Section[] = [];
  let current: { level: 2 | 3; text: string; id: string; body: string[] } | null = null;
  let inFencedBlock = false;

  const flush = () => {
    if (!current) return;
    const snippet = current.body
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200);
    sections.push({
      level: current.level,
      text: current.text,
      id: current.id,
      snippet,
    });
    current = null;
  };

  for (const rawLine of source.split("\n")) {
    const line = rawLine.trimEnd();

    if (line.startsWith("```")) {
      inFencedBlock = !inFencedBlock;
      continue;
    }
    if (inFencedBlock) continue;

    const m2 = line.match(/^## (.+)$/);
    const m3 = line.match(/^### (.+)$/);
    if (m2 || m3) {
      flush();
      const text = cleanHeading((m2 || m3)![1]);
      current = {
        level: m2 ? 2 : 3,
        text,
        id: slugger.slug(text),
        body: [],
      };
      continue;
    }

    if (current && line) {
      const stripped = cleanHeading(line).trim();
      // Skip JSX tags, callout markers, markdown tables.
      if (
        stripped &&
        !stripped.startsWith("<") &&
        !stripped.startsWith("|") &&
        !stripped.startsWith("→")
      ) {
        current.body.push(stripped);
      }
    }
  }

  flush();
  return sections;
}
