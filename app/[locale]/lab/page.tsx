import Image from "next/image";
import Link from "next/link";
import { ChapterSidebar } from "@/app/components/chapter-sidebar";
import { CHAPTERS } from "@/lib/chapters";
import { getAllLibraryEntries } from "@/lib/library";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export default async function LabIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const libraryEntries = await getAllLibraryEntries(validLocale);

  const headings = {
    en: {
      eyebrow: "The lab",
      title: "Ten chapters. One practice.",
      lede: "Go top to bottom, or pick what you need. Every chapter ends with something you can try immediately.",
      libraryEyebrow: "The library",
      libraryTitle: "Depth on demand.",
      libraryLede:
        "The spine teaches the path. The library goes further on the topics that won't fit a chapter without bloating it.",
      libraryGoesDeeper: "Goes deeper from",
      libraryAll: "Browse the library →",
    },
    cs: {
      eyebrow: "Lab",
      title: "Deset kapitol. Jedna praxe.",
      lede: "Projdi odshora dolů, nebo si vyber, co ti zrovna sedí. Každá kapitola končí něčím, co můžeš hned zkusit.",
      libraryEyebrow: "Knihovna",
      libraryTitle: "Hloubka, když ji potřebuješ.",
      libraryLede:
        "Páteř vede cestou. Knihovna jde dál v tématech, která by se do kapitoly nevešla, aniž by ji nafoukla.",
      libraryGoesDeeper: "Navazuje na",
      libraryAll: "Procházet knihovnu →",
    },
  };

  const m = headings[validLocale];

  return (
    <div className="grid gap-10 md:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="md:sticky md:top-10 h-fit">
        <ChapterSidebar locale={validLocale} />
      </aside>

      <main>
        <div className="max-w-2xl landing-rise">
          <p
            className="text-xs uppercase tracking-[0.2em] mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            {m.eyebrow}
          </p>
          <h1
            className="text-4xl md:text-5xl font-semibold leading-[1.1] mb-5"
            style={{ color: "var(--text-primary)" }}
          >
            {m.title}
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {m.lede}
          </p>
        </div>

        <ol
          className="grid gap-4 mt-10 md:grid-cols-2 landing-rise"
          style={{ ["--landing-rise-delay" as string]: "120ms" }}
        >
          {CHAPTERS.map((chapter, idx) => {
            const isFirst = idx === 0;
            const eyebrowParts = chapter.eyebrows[validLocale].split(" · ");
            const sectionLabel = eyebrowParts[1] ?? chapter.eyebrows[validLocale];
            return (
              <li key={chapter.slug} className={isFirst ? "md:col-span-2" : ""}>
                <Link
                  href={`/${validLocale}/lab/${chapter.slug}`}
                  className="motion-card group flex flex-col h-full overflow-hidden rounded-xl border"
                  style={{
                    background: "var(--surface-elevated)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div
                    className="relative w-full aspect-[2/1] overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--surface-sunken) 0%, var(--surface-elevated) 100%)",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {chapter.heroImage ? (
                      <Image
                        src={chapter.heroImage}
                        alt=""
                        fill
                        sizes={
                          isFirst
                            ? "(min-width: 768px) 800px, 100vw"
                            : "(min-width: 768px) 400px, 100vw"
                        }
                        className="object-cover"
                        priority={isFirst}
                      />
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center font-mono text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {String(chapter.order).padStart(2, "0")}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-4">
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span
                        className="font-mono text-xs"
                        style={{ color: "var(--accent-surface)" }}
                      >
                        {String(chapter.order).padStart(2, "0")}
                      </span>
                      <span
                        className="text-[10px] uppercase tracking-[0.16em]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {sectionLabel}
                      </span>
                    </div>
                    <div
                      className="text-lg font-semibold leading-snug mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {chapter.titles[validLocale]}
                    </div>
                    <div
                      className="text-xs mt-auto"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {chapter.readTime[validLocale]}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>

        {libraryEntries.length > 0 ? (
          <section
            className="mt-20 landing-rise"
            style={{ ["--landing-rise-delay" as string]: "200ms" }}
            aria-labelledby="lab-library-heading"
          >
            <div className="max-w-2xl">
              <p
                className="text-xs uppercase tracking-[0.2em] mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                {m.libraryEyebrow}
              </p>
              <h2
                id="lab-library-heading"
                className="text-2xl md:text-3xl font-semibold leading-[1.15] mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {m.libraryTitle}
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {m.libraryLede}
              </p>
            </div>

            <ul className="grid gap-3 mt-8">
              {libraryEntries.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/${validLocale}/lab/library/${entry.slug}`}
                    className="motion-card block p-4 rounded-lg border"
                    style={{
                      background: "var(--surface-elevated)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {entry.affinity ? (
                      <p
                        className="text-[10px] uppercase tracking-[0.18em] mb-1.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {m.libraryGoesDeeper}{" "}
                        <span style={{ color: "var(--text-secondary)" }}>
                          {entry.affinity.titles[validLocale]}
                        </span>
                      </p>
                    ) : null}
                    <div className="flex items-baseline justify-between gap-4">
                      <h3
                        className="text-base font-semibold leading-snug"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {entry.title}
                      </h3>
                      <span
                        className="text-xs whitespace-nowrap"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {entry.readTime}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Link
                href={`/${validLocale}/lab/library`}
                className="motion-link text-sm"
                style={{ color: "var(--accent-surface)" }}
              >
                {m.libraryAll}
              </Link>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
