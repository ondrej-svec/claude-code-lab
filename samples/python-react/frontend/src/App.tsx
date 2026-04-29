import { useEffect, useMemo, useState } from "react";
import type { Entry, Locale } from "./types";
import { listEntries } from "./api";
import { Boot } from "./components/Boot";
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

const LS_BOOTED = "cc-lab-guide:booted";
const LS_LOCALE = "cc-lab-guide:locale";

function readLocale(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    const saved = window.localStorage.getItem(LS_LOCALE);
    if (saved === "en" || saved === "cs") return saved;
  } catch {
    // localStorage unavailable (private mode etc.) — fall through.
  }
  return "en";
}

function readBooted(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(LS_BOOTED) === "true";
  } catch {
    return true;
  }
}

export function App() {
  const [locale, setLocale] = useState<Locale>(readLocale);
  const [booted, setBooted] = useState<boolean>(readBooted);
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  // Persist locale.
  useEffect(() => {
    try {
      window.localStorage.setItem(LS_LOCALE, locale);
    } catch {
      // Ignore — preference just won't persist.
    }
  }, [locale]);

  // Fetch entries when locale changes. AbortController prevents stale writes.
  useEffect(() => {
    const ctrl = new AbortController();
    setEntries(null);
    setError(null);
    setTag(null);
    fetch(`/api/entries?locale=${locale}`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`listEntries failed: ${r.status}`);
        return r.json() as Promise<Entry[]>;
      })
      .then((data) => {
        if (!ctrl.signal.aborted) setEntries(data);
      })
      .catch((e) => {
        if (!ctrl.signal.aborted) setError(String(e));
      });
    return () => ctrl.abort();
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

  function handleBootDone() {
    try {
      window.localStorage.setItem(LS_BOOTED, "true");
    } catch {
      // Ignore — boot will replay next time, no big deal.
    }
    setBooted(true);
  }

  if (!booted) {
    return <Boot locale={locale} onDone={handleBootDone} />;
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
