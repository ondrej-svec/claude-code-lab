import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { remarkMermaid } from "@/lib/remark-mermaid";
import { PageToc } from "@/app/components/page-toc";
import { PageTocMobile } from "@/app/components/page-toc-mobile";
import { mdxComponents } from "@/app/components/mdx-components";
import { extractToc } from "@/lib/content";
import { LIBRARY_SLUGS, getLibraryEntry } from "@/lib/library";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    LIBRARY_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export default async function LibraryEntryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const validLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;

  const entry = await getLibraryEntry(validLocale, slug);
  if (!entry) notFound();

  const toc = extractToc(entry.source);

  const labels = {
    en: {
      eyebrow: "Library",
      affinity: "Goes deeper from",
      readTime: entry.readTime,
    },
    cs: {
      eyebrow: "Knihovna",
      affinity: "Navazuje na",
      readTime: entry.readTime,
    },
  };
  const l = labels[validLocale];

  return (
    <>
      <main className="min-w-0">
        <article className="max-w-2xl landing-rise">
          <p
            className="text-xs uppercase tracking-[0.2em] mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            {l.eyebrow} · {l.readTime}
          </p>
          {entry.affinity ? (
            <p
              className="text-sm mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              {l.affinity}{" "}
              <Link
                href={`/${validLocale}/lab/${entry.affinity.slug}`}
                className="motion-link underline"
                style={{ color: "var(--text-primary)" }}
              >
                {entry.affinity.titles[validLocale]}
              </Link>
            </p>
          ) : null}
          <PageTocMobile headings={toc} locale={validLocale} />
          <MDXRemote
            source={entry.source}
            components={mdxComponents}
            options={{
              parseFrontmatter: false,
              mdxOptions: {
                remarkPlugins: [remarkGfm, remarkMermaid],
                rehypePlugins: [rehypeSlug],
              },
            }}
          />
        </article>
      </main>

      <aside className="hidden lg:block lg:sticky lg:top-10 h-fit">
        <PageToc headings={toc} locale={validLocale} />
      </aside>
    </>
  );
}
