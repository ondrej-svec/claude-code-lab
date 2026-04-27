import type { Entry, Locale } from "../types";
import { Badge } from "./Badge";
import { renderMarkdown } from "../markdown";

function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const intl = locale === "cs" ? "cs-CZ" : "en-GB";
  return new Intl.DateTimeFormat(intl, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function EntryCard({ entry, locale }: { entry: Entry; locale: Locale }) {
  return (
    <article className="entry">
      <header className="entry__head">
        <h2 className="entry__title">{entry.title}</h2>
        <Badge kind={entry.badge} locale={locale} />
      </header>
      <div
        className="entry__body"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(entry.body) }}
      />
      <footer className="entry__meta">
        <span>{entry.contributor}</span>
        <span className="entry__meta-divider" aria-hidden />
        <span>{formatDate(entry.created_at, locale)}</span>
        {entry.tags.length > 0 && (
          <>
            <span className="entry__meta-divider" aria-hidden />
            <span className="entry__tags">
              {entry.tags.map((tag) => (
                <span key={tag} className="entry__tag">
                  {tag}
                </span>
              ))}
            </span>
          </>
        )}
      </footer>
    </article>
  );
}
