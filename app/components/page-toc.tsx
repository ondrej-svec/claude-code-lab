"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export function PageToc({
  headings,
  locale,
}: {
  headings: TocHeading[];
  locale: Locale;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    // Build a list of observed elements in document order.
    const targets = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    // Track which headings are currently in the visible band. We pick
    // the topmost visible heading as the active one, falling back to
    // the last heading we passed while scrolling down.
    const visibleIds = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibleIds.add(entry.target.id);
          else visibleIds.delete(entry.target.id);
        }

        // Pick the first heading in document order that is currently visible.
        const firstVisible = targets.find((t) => visibleIds.has(t.id));
        if (firstVisible) {
          setActiveId(firstVisible.id);
        } else {
          // Nothing currently in the band — use the last heading
          // whose top is above the viewport.
          const scrollY = window.scrollY + 120;
          let lastAbove: string | null = null;
          for (const t of targets) {
            if (t.offsetTop <= scrollY) lastAbove = t.id;
            else break;
          }
          if (lastAbove) setActiveId(lastAbove);
        }
      },
      {
        rootMargin: "-96px 0px -60% 0px",
        threshold: [0, 1],
      },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const label = locale === "cs" ? "Na této stránce" : "On this page";

  return (
    <nav
      aria-label={label}
      className="hidden lg:block text-sm"
    >
      <div
        className="text-xs uppercase tracking-[0.18em] mb-3"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </div>
      <ul className="space-y-1.5">
        {headings.map((h) => {
          const active = h.id === activeId;
          return (
            <li
              key={h.id}
              style={{ paddingLeft: h.level === 3 ? "0.75rem" : 0 }}
            >
              <a
                href={`#${h.id}`}
                className="motion-link block py-0.5 leading-snug"
                style={{
                  color: active
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
                  fontWeight: active ? 600 : 400,
                  borderLeft: h.level === 3
                    ? `1px solid ${active ? "var(--accent-surface)" : "var(--border)"}`
                    : "none",
                  paddingLeft: h.level === 3 ? "0.75rem" : 0,
                  marginLeft: h.level === 3 ? "-0.75rem" : 0,
                }}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
