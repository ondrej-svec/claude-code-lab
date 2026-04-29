import type { Entry, Locale } from "../types";
import { EntryCard } from "./EntryCard";

const EMPTY_COPY: Record<Locale, string> = {
  en: "Nothing matches. Try a different search.",
  cs: "Nic se neshoduje. Zkus jiné hledání.",
};

export function EntryList({ entries, locale }: { entries: Entry[]; locale: Locale }) {
  if (entries.length === 0) {
    return <div className="empty">{EMPTY_COPY[locale]}</div>;
  }
  return (
    <ul className="entry-list">
      {entries.map((entry) => (
        <li key={entry.id}>
          <EntryCard entry={entry} locale={locale} />
        </li>
      ))}
    </ul>
  );
}
