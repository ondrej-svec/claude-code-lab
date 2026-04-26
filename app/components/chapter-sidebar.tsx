import Link from "next/link";
import { CHAPTERS } from "@/lib/chapters";
import type { Locale } from "@/lib/i18n";

export function ChapterSidebar({
  locale,
  currentSlug,
  currentSection,
}: {
  locale: Locale;
  currentSlug?: string;
  currentSection?: "library";
}) {
  const libraryActive = currentSection === "library";
  return (
    <nav aria-label="Chapters" className="space-y-1">
      <div
        className="text-xs uppercase tracking-[0.18em] mb-3"
        style={{ color: "var(--text-muted)" }}
      >
        {locale === "cs" ? "Obsah" : "Contents"}
      </div>
      {CHAPTERS.map((chapter) => {
        const isActive = chapter.slug === currentSlug;
        const href = `/${locale}/lab/${chapter.slug}`;
        return (
          <Link
            key={chapter.slug}
            href={href}
            className="motion-link block py-1.5 text-sm leading-snug"
            style={{
              color: isActive
                ? "var(--text-primary)"
                : "var(--text-secondary)",
              fontWeight: isActive ? 600 : 400,
            }}
          >
            <span
              className="inline-block w-6 font-mono text-xs"
              style={{
                color: isActive ? "var(--accent-surface)" : "var(--text-muted)",
              }}
            >
              {String(chapter.order).padStart(2, "0")}
            </span>
            {chapter.titles[locale]}
          </Link>
        );
      })}
      <div
        className="mt-4 pt-4 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <Link
          href={`/${locale}/lab/library`}
          className="motion-link block py-1.5 text-sm leading-snug"
          style={{
            color: libraryActive
              ? "var(--text-primary)"
              : "var(--text-secondary)",
            fontWeight: libraryActive ? 600 : 400,
          }}
        >
          <span
            className="inline-block w-6 font-mono text-xs"
            style={{
              color: libraryActive
                ? "var(--accent-surface)"
                : "var(--text-muted)",
            }}
          >
            +
          </span>
          {locale === "cs" ? "Knihovna" : "Library"}
        </Link>
      </div>
    </nav>
  );
}
