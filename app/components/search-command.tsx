"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchEntry } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

const MAX_RESULTS = 20;

type Props = {
  entries: SearchEntry[];
  locale: Locale;
};

export function SearchCommand({ entries, locale }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  const openSearch = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  }, []);

  // Keyboard: Cmd/Ctrl+K opens; Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) setOpen(false);
        else openSearch();
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openSearch]);

  // When opened, focus the input. Query/index resets happen in openSearch().
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // With no query, show top-level chapter entries first.
      return entries
        .filter((e) => e.level === 1)
        .sort((a, b) => a.chapterOrder - b.chapterOrder)
        .slice(0, MAX_RESULTS);
    }

    const scored = entries
      .map((entry) => ({ entry, score: scoreEntry(entry, q) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS)
      .map((item) => item.entry);

    return scored;
  }, [entries, query]);

  const activeResultIndex =
    results.length === 0 ? 0 : Math.min(activeIndex, results.length - 1);

  const go = useCallback(
    (entry: SearchEntry) => {
      const base = `/${locale}/lab/${entry.chapterSlug}`;
      const href = entry.headingId ? `${base}#${entry.headingId}` : base;
      router.push(href);
      setOpen(false);
    },
    [locale, router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, Math.min(results.length - 1, i + 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[activeResultIndex];
      if (target) go(target);
    }
  };

  // Keep active item in view as arrow keys move it.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[activeResultIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [activeResultIndex]);

  const labels =
    locale === "cs"
      ? {
          placeholder: "Hledej v kapitolách…",
          empty: "Nic nenalezeno.",
          hint: "↑↓ pohyb · ↵ otevřít · Esc zavřít",
          button: "Hledat",
        }
      : {
          placeholder: "Search chapters…",
          empty: "No matches.",
          hint: "↑↓ navigate · ↵ open · Esc close",
          button: "Search",
        };

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        aria-label={labels.button}
        className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs transition"
        style={{
          borderColor: "var(--border)",
          color: "var(--text-muted)",
          background: "var(--surface-elevated)",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden
        >
          <circle cx="7" cy="7" r="5" />
          <path d="M14 14L10.5 10.5" strokeLinecap="round" />
        </svg>
        <span className="hidden sm:inline">{labels.button}</span>
        <kbd
          className="font-mono hidden sm:inline"
          style={{ color: "var(--text-muted)" }}
        >
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={labels.button}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
          style={{ background: "var(--overlay-scrim)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl overflow-hidden"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border-strong)",
              boxShadow: "var(--shadow-overlay)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center gap-3 px-4 py-3 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                style={{ color: "var(--text-muted)" }}
                aria-hidden
              >
                <circle cx="7" cy="7" r="5" />
                <path d="M14 14L10.5 10.5" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onKeyDown}
                placeholder={labels.placeholder}
                className="flex-1 bg-transparent outline-none text-base"
                style={{ color: "var(--text-primary)" }}
              />
            </div>

            <ul
              ref={listRef}
              className="max-h-80 overflow-y-auto py-2"
              role="listbox"
            >
              {results.length === 0 && (
                <li
                  className="px-4 py-3 text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {labels.empty}
                </li>
              )}
              {results.map((entry, i) => {
                const active = i === activeResultIndex;
                return (
                  <li
                    key={`${entry.chapterSlug}-${entry.headingId ?? "root"}`}
                    role="option"
                    aria-selected={active}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => go(entry)}
                      className="w-full text-left px-4 py-2.5 flex items-baseline gap-3 transition"
                      style={{
                        background: active
                          ? "var(--surface-elevated)"
                          : "transparent",
                        color: "var(--text-primary)",
                      }}
                    >
                      <span
                        className="font-mono text-xs w-8 flex-none pt-0.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {String(entry.chapterOrder).padStart(2, "0")}
                      </span>
                      <span className="flex-1 min-w-0">
                        {entry.heading ? (
                          <>
                            <span
                              className="block text-sm"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {entry.heading}
                            </span>
                            <span
                              className="block text-xs"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {entry.chapterTitle}
                            </span>
                          </>
                        ) : (
                          <span
                            className="block text-sm font-semibold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {entry.chapterTitle}
                          </span>
                        )}
                        {entry.snippet && query.trim().length > 1 && (
                          <span
                            className="block text-xs mt-1 line-clamp-2"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {entry.snippet}
                          </span>
                        )}
                      </span>
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.18em] flex-none pt-0.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {entry.level === 1
                          ? "ch"
                          : entry.level === 2
                            ? "§"
                            : "§§"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div
              className="px-4 py-2 text-[11px] border-t font-mono"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              {labels.hint}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Fuzzy scorer — higher score = better match. Title/heading carry the
// most weight; snippet adds a weaker signal so "rate limiting" hits
// chapter 6 even though the word doesn't appear in any heading.
function scoreEntry(entry: SearchEntry, q: string): number {
  const titles = [
    entry.chapterTitle.toLowerCase(),
    entry.heading?.toLowerCase() ?? "",
  ];

  let score = 0;
  for (const hay of titles) {
    if (!hay) continue;
    if (hay === q) score += 100;
    else if (hay.startsWith(q)) score += 60;
    else if (hay.includes(q)) score += 40;
    else if (subsequenceMatch(hay, q)) score += q.length * 2;
  }

  const snippet = entry.snippet?.toLowerCase();
  if (snippet) {
    if (snippet.includes(q)) score += 15;
    else if (subsequenceMatch(snippet, q)) score += q.length * 0.5;
  }

  // Boost chapter-level entries so top-level matches surface first when
  // the query matches both a chapter and one of its sections.
  if (entry.level === 1) score += 5;

  return score;
}

function subsequenceMatch(hay: string, q: string): boolean {
  let hi = 0;
  let qi = 0;
  while (hi < hay.length && qi < q.length) {
    if (hay[hi] === q[qi]) qi++;
    hi++;
  }
  return qi === q.length;
}
