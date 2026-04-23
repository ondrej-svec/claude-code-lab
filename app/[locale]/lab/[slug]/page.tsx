import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { ChapterSidebar } from "@/app/components/chapter-sidebar";
import { PageToc } from "@/app/components/page-toc";
import { PageTocMobile } from "@/app/components/page-toc-mobile";
import { mdxComponents } from "@/app/components/mdx-components";
import { extractToc, getChapterSource } from "@/lib/content";
import {
  CHAPTERS,
  getChapter,
  getNextChapter,
  getPreviousChapter,
} from "@/lib/chapters";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    CHAPTERS.map((chapter) => ({ locale, slug: chapter.slug })),
  );
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const validLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  const source = await getChapterSource(validLocale, slug);
  if (!source) notFound();

  const toc = extractToc(source);
  const next = getNextChapter(slug);
  const prev = getPreviousChapter(slug);

  const labels = {
    en: { previous: "Previous", next: "Next" },
    cs: { previous: "Předchozí", next: "Další" },
  };
  const l = labels[validLocale];

  return (
    <div className="grid gap-10 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)_200px]">
      <aside className="md:sticky md:top-10 h-fit">
        <ChapterSidebar locale={validLocale} currentSlug={slug} />
      </aside>

      <main className="min-w-0">
        <article className="max-w-2xl landing-rise">
          <p
            className="text-xs uppercase tracking-[0.2em] mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            {chapter.eyebrows[validLocale]} · {chapter.readTime[validLocale]}
          </p>
          <PageTocMobile headings={toc} locale={validLocale} />
          <MDXRemote
            source={source}
            components={mdxComponents}
            options={{
              parseFrontmatter: true,
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug],
              },
            }}
          />

          <nav
            className="mt-16 pt-8 grid gap-4 md:grid-cols-2 border-t"
            style={{ borderColor: "var(--border)" }}
            aria-label="Chapter navigation"
          >
            {prev ? (
              <Link
                href={`/${validLocale}/lab/${prev.slug}`}
                className="motion-card block p-4 rounded-lg border"
                style={{
                  background: "var(--surface-elevated)",
                  borderColor: "var(--border)",
                }}
              >
                <div
                  className="text-xs uppercase tracking-[0.16em] mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  ← {l.previous}
                </div>
                <div
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {prev.titles[validLocale]}
                </div>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/${validLocale}/lab/${next.slug}`}
                className="motion-card block p-4 rounded-lg border text-right"
                style={{
                  background: "var(--surface-elevated)",
                  borderColor: "var(--border)",
                }}
              >
                <div
                  className="text-xs uppercase tracking-[0.16em] mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {l.next} →
                </div>
                <div
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {next.titles[validLocale]}
                </div>
              </Link>
            ) : null}
          </nav>
        </article>
      </main>

      <aside className="hidden lg:block lg:sticky lg:top-10 h-fit">
        <PageToc headings={toc} locale={validLocale} />
      </aside>
    </div>
  );
}
