"use client";

import { useRef } from "react";
import type { TocHeading } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export function PageTocMobile({
  headings,
  locale,
}: {
  headings: TocHeading[];
  locale: Locale;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  if (headings.length === 0) return null;

  const label = locale === "cs" ? "Na této stránce" : "On this page";
  const count = headings.length;

  return (
    <details
      ref={detailsRef}
      className="lg:hidden mb-8 rounded-lg border"
      style={{
        background: "var(--surface-elevated)",
        borderColor: "var(--border)",
      }}
    >
      <summary
        className="cursor-pointer px-4 py-3 text-sm flex items-center justify-between select-none"
        style={{ color: "var(--text-primary)" }}
      >
        <span className="font-semibold">{label}</span>
        <span
          className="text-xs uppercase tracking-[0.18em]"
          style={{ color: "var(--text-muted)" }}
        >
          {count}
        </span>
      </summary>
      <nav
        aria-label={label}
        className="px-4 pb-4 pt-1 text-sm"
      >
        <ul className="space-y-1.5">
          {headings.map((h) => (
            <li
              key={h.id}
              style={{ paddingLeft: h.level === 3 ? "1rem" : 0 }}
            >
              <a
                href={`#${h.id}`}
                onClick={() => detailsRef.current?.removeAttribute("open")}
                className="motion-link block py-0.5 leading-snug"
                style={{
                  color:
                    h.level === 3
                      ? "var(--text-secondary)"
                      : "var(--text-primary)",
                }}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
