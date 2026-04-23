import { promises as fs } from "node:fs";
import path from "node:path";
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
