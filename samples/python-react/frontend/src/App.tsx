import { useEffect, useMemo, useState } from "react";
import type { Entry, Locale } from "./types";
import { listEntries } from "./api";
import { LocaleToggle } from "./components/LocaleToggle";
import { Search } from "./components/Search";
import { TagFilter } from "./components/TagFilter";
import { EntryList } from "./components/EntryList";
import { NewEntryForm } from "./components/NewEntryForm";

const COPY: Record<Locale, { tagline: string; loading: string }> = {
  en: {
    tagline: "An indispensable companion to the Galaxy.",
    loading: "Tuning the Sub-Etha relay…",
  },
  cs: {
    tagline: "Nepostradatelný společník napříč Galaxií.",
    loading: "Ladím Sub-Etha vysílač…",
  },
};

export function App() {
  const [locale, setLocale] = useState<Locale>("en");
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  useEffect(() => {
    setEntries(null);
    setError(null);
    setTag(null);
    listEntries(locale)
      .then(setEntries)
      .catch((e) => setError(String(e)));
  }, [locale]);

  const allTags = useMemo(() => {
    if (!entries) return [];
    const seen = new Set<string>();
    for (const e of entries) for (const t of e.tags) seen.add(t);
    return Array.from(seen).sort();
  }, [entries]);

  const visible = useMemo(() => {
    if (!entries) return [];
    const q = search.trim().toLowerCase();
    return entries.filter((e) => {
      if (tag && !e.tags.includes(tag)) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) || e.body.toLowerCase().includes(q)
      );
    });
  }, [entries, search, tag]);

  function handleCreated(entry: Entry) {
    setEntries((prev) => (prev ? [...prev, entry] : [entry]));
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1 className="app-title">The Guide</h1>
          <div className="app-tagline">{COPY[locale].tagline}</div>
        </div>
        <div className="app-header__actions">
          <span className="app-don-t-panic">Don't Panic</span>
          <LocaleToggle locale={locale} onChange={setLocale} />
        </div>
      </header>

      <section className="controls">
        <Search value={search} onChange={setSearch} locale={locale} />
        <TagFilter tags={allTags} active={tag} onToggle={setTag} />
      </section>

      {error && <div className="error">{error}</div>}
      {!entries && !error && <div className="empty">{COPY[locale].loading}</div>}
      {entries && <EntryList entries={visible} locale={locale} />}

      {entries && <NewEntryForm locale={locale} onCreated={handleCreated} />}
    </main>
  );
}
