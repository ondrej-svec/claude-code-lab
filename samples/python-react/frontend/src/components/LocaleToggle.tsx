import type { Locale } from "../types";

const LABELS: Record<Locale, string> = {
  en: "EN",
  cs: "CS",
};

export function LocaleToggle({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (next: Locale) => void;
}) {
  const next: Locale = locale === "en" ? "cs" : "en";
  const ariaLabel = locale === "en" ? "Switch to Czech" : "Přepnout do angličtiny";
  return (
    <button
      type="button"
      className="locale-toggle"
      onClick={() => onChange(next)}
      aria-label={ariaLabel}
      title="Babel Fish"
    >
      <span className="locale-toggle__fish" aria-hidden>
        🐟
      </span>
      <span>{LABELS[locale]}</span>
    </button>
  );
}
