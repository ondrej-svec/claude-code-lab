import Link from "next/link";
import { ChapterSidebar } from "@/app/components/chapter-sidebar";
import { Screenshot } from "@/app/components/screenshot";
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
      title: "Nine chapters. One practice.",
      lede: "Go top to bottom, or pick what you need. Every chapter ends with something you can try immediately.",
      journey: {
        alt: "Six-panel comic of a Heart-of-Gold-style spaceship traveling through the lab's learning arc: docking at first contact, a small first task, learning context (CLAUDE.md), the shift from control to a verification harness, gaining ecosystem extensions, and a final compounding journey trail with a tiny towel draped on the antenna.",
        caption: "Six beats. Nine chapters. One practice.",
      },
    },
    cs: {
      eyebrow: "Lab",
      title: "Devět kapitol. Jedna praxe.",
      lede: "Projdi odshora dolů, nebo si vyber, co ti zrovna sedí. Každá kapitola končí něčím, co můžeš hned zkusit.",
      journey: {
        alt: "Šestipanelový komiks vesmírné lodi ve stylu Heart of Gold, která prochází obloukem labu: zakotvení při prvním kontaktu, malý první úkol, učení kontextu (CLAUDE.md), posun od kontroly k ověřovacímu harnessu, získání ekosystémových rozšíření a závěrečná cesta se smyčkou compoundingu — s malým ručníkem přehozeným přes anténu.",
        caption: "Šest zastavení. Devět kapitol. Jedna praxe.",
      },
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
            className="text-lg leading-relaxed mb-10"
            style={{ color: "var(--text-secondary)" }}
          >
            {m.lede}
          </p>

          <Screenshot
            src="/journey-comic.png"
            alt={m.journey.alt}
            caption={m.journey.caption}
          />

          <ol className="space-y-4 mt-10">
            {CHAPTERS.map((chapter) => (
              <li key={chapter.slug}>
                <Link
                  href={`/${validLocale}/lab/${chapter.slug}`}
                  className="motion-card block p-5 rounded-xl border"
                  style={{
                    background: "var(--surface-elevated)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div
                    className="text-xs uppercase tracking-[0.16em] mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {chapter.eyebrows[validLocale]}
                  </div>
                  <div
                    className="text-xl font-semibold mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {chapter.titles[validLocale]}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {chapter.readTime[validLocale]}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </div>
  );
}
