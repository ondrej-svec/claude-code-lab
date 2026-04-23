import Link from "next/link";
import { ThemeSwitcher } from "@/app/components/theme-switcher";
import { LanguageSwitcher } from "@/app/components/language-switcher";
import { DEFAULT_LOCALE, getMessages, isLocale } from "@/lib/i18n";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const m = getMessages(validLocale);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--surface)" }}
    >
      <header className="flex items-center justify-between px-8 py-6 max-w-5xl mx-auto w-full">
        <span
          className="text-sm tracking-wide"
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-display)",
          }}
        >
          claude-code-lab
        </span>
        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLocale={validLocale} />
          <ThemeSwitcher />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="max-w-2xl w-full landing-rise">
          <p
            className="text-xs uppercase tracking-[0.2em] mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            {m.landing.eyebrow}
          </p>
          <h1
            className="text-5xl md:text-6xl font-semibold leading-[1.05] mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            {m.landing.title}
          </h1>
          <p
            className="text-lg leading-relaxed mb-10"
            style={{ color: "var(--text-secondary)" }}
          >
            {m.landing.lede}
          </p>

          <div className="flex items-center gap-4">
            <Link
              href={`/${validLocale}/lab`}
              className="motion-button inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium"
              style={{
                background: "var(--accent-surface)",
                color: "var(--accent-text)",
              }}
            >
              {m.landing.cta}
            </Link>
          </div>
        </div>
      </main>

      <footer
        className="px-8 py-6 max-w-5xl mx-auto w-full text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        {m.landing.footer}
      </footer>
    </div>
  );
}
