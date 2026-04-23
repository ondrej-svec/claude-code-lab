import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeSwitcher } from "@/app/components/theme-switcher";
import { LanguageSwitcher } from "@/app/components/language-switcher";
import { GitHubLink } from "@/app/components/github-link";
import { SearchCommand } from "@/app/components/search-command";
import { buildSearchIndex } from "@/lib/search-index";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export default async function LabLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const searchIndex = await buildSearchIndex(validLocale);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--surface)" }}
    >
      <header
        className="border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-6xl mx-auto w-full px-6 py-4 flex items-center justify-between">
          <Link
            href={`/${validLocale}`}
            className="motion-link text-sm tracking-wide"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-display)",
            }}
          >
            claude-code-lab
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <SearchCommand entries={searchIndex} locale={validLocale} />
            <LanguageSwitcher currentLocale={validLocale} />
            <GitHubLink />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {children}
      </div>
    </div>
  );
}
