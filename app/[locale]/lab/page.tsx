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
      title: "Seven chapters. One practice.",
      lede: "Work top to bottom on a Monday session. Skip and self-pace the rest of the week. Every chapter ends with something you can try immediately.",
    },
    cs: {
      eyebrow: "Lab",
      title: "Sedm kapitol. Jedna praxe.",
      lede: "V pondělní sessionu projdeme odshora dolů. Zbytek týdne si prochází vlastním tempem. Každá kapitola končí něčím, co můžeš hned zkusit.",
    },
  };

  const m = headings[validLocale];

  return (
    <>
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

          <ol className="space-y-4">
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
    </>
  );
}
