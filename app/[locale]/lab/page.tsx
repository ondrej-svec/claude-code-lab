import Image from "next/image";
import Link from "next/link";
import { ChapterSidebar } from "@/app/components/chapter-sidebar";
import { CHAPTERS } from "@/lib/chapters";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export default async function LabIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;

  const headings = {
    en: {
      eyebrow: "The lab",
      title: "Ten chapters. One practice.",
      lede: "Go top to bottom, or pick what you need. Every chapter ends with something you can try immediately.",
    },
    cs: {
      eyebrow: "Lab",
      title: "Deset kapitol. Jedna praxe.",
      lede: "Projdi odshora dolů, nebo si vyber, co ti zrovna sedí. Každá kapitola končí něčím, co můžeš hned zkusit.",
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
      </main>
    </div>
  );
}
