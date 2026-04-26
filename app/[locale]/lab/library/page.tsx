import Link from "next/link";
import { CHAPTERS } from "@/lib/chapters";
import { getAllLibraryEntries } from "@/lib/library";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export default async function LibraryIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const entries = await getAllLibraryEntries(validLocale);

  // Group entries by chapter, preserving spine order.
  const byChapter = CHAPTERS.map((chapter) => ({
    chapter,
    entries: entries.filter((e) => e.chapter === chapter.slug),
  })).filter((g) => g.entries.length > 0);

  const headings = {
    en: {
      eyebrow: "The library",
      title: "Depth on demand.",
      lede: "Each entry sits next to a spine chapter and goes further than the chapter could without bloating the path. Browse by chapter affinity, or jump straight to what you need.",
      empty:
        "No entries yet for this locale. The library is growing — check back, or read the EN version.",
      goesDeeperFrom: "Goes deeper from",
      readTimeSep: "·",
    },
    cs: {
      eyebrow: "Knihovna",
      title: "Hloubka, když ji potřebuješ.",
      lede: "Každý záznam stojí vedle některé kapitoly páteře a jde dál, než kam by se v kapitole vešlo. Procházej podle kapitoly nebo skoč rovnou na to, co tě zrovna zajímá.",
      empty:
        "Pro tento jazyk zatím žádné záznamy. Knihovna se rozrůstá — zastav se příště, nebo si přečti EN verzi.",
      goesDeeperFrom: "Navazuje na",
      readTimeSep: "·",
    },
  };
  const m = headings[validLocale];

  return (
    <div className="max-w-3xl landing-rise">
      <p
        className="text-xs uppercase tracking-[0.2em] mb-3"
        style={{ color: "var(--text-muted)" }}
      >
        {m.eyebrow}
      </p>
      <h1
        className="text-4xl md:text-5xl font-semibold leading-[1.05] mb-6"
        style={{ color: "var(--text-primary)" }}
      >
        {m.title}
      </h1>
      <p
        className="text-lg leading-relaxed mb-12"
        style={{ color: "var(--text-secondary)" }}
      >
        {m.lede}
      </p>

      {byChapter.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>{m.empty}</p>
      ) : (
        <div className="space-y-12">
          {byChapter.map(({ chapter, entries }) => (
            <section key={chapter.slug}>
              <p
                className="text-xs uppercase tracking-[0.18em] mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                {m.goesDeeperFrom}{" "}
                <Link
                  href={`/${validLocale}/lab/${chapter.slug}`}
                  className="motion-link"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {chapter.titles[validLocale]}
                </Link>
              </p>
              <div className="space-y-4">
                {entries.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/${validLocale}/lab/library/${entry.slug}`}
                    className="motion-card block p-5 rounded-lg border"
                    style={{
                      background: "var(--surface-elevated)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <h2
                        className="text-xl font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {entry.title}
                      </h2>
                      <span
                        className="text-xs whitespace-nowrap"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {entry.readTime}
                      </span>
                    </div>
                    <p
                      className="text-sm leading-relaxed mb-3"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {entry.snippet}
                    </p>
                    {entry.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              color: "var(--text-muted)",
                              background: "var(--surface)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
