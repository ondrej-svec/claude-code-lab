import type { Locale } from "../types";

const PLACEHOLDER: Record<Locale, string> = {
  en: "Search the Guide…",
  cs: "Hledat v Průvodci…",
};

export function Search({
  value,
  onChange,
  locale,
}: {
  value: string;
  onChange: (next: string) => void;
  locale: Locale;
}) {
  return (
    <input
      type="search"
      className="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={PLACEHOLDER[locale]}
      aria-label={PLACEHOLDER[locale]}
    />
  );
}
