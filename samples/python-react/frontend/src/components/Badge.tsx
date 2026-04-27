import type { Badge as BadgeKind, Locale } from "../types";

const LABELS: Record<Locale, Record<BadgeKind, string>> = {
  en: {
    "mostly-harmless": "Mostly harmless",
    "mostly-dangerous": "Mostly dangerous",
    unknown: "Unknown",
  },
  cs: {
    "mostly-harmless": "Spíše neškodné",
    "mostly-dangerous": "Spíše nebezpečné",
    unknown: "Neznámé",
  },
};

export function Badge({ kind, locale }: { kind: BadgeKind; locale: Locale }) {
  return (
    <span className={`badge badge--${kind}`}>
      <span className="badge__dot" aria-hidden />
      {LABELS[locale][kind]}
    </span>
  );
}
