import Image from "next/image";
import { ThemeSwitcher } from "@/app/components/theme-switcher";
import { LanguageSwitcher } from "@/app/components/language-switcher";
import { GitHubLink } from "@/app/components/github-link";
import { LandingCta } from "@/app/components/landing-cta";
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
          <GitHubLink />
          <ThemeSwitcher />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 sm:px-8 py-6 sm:py-10 lg:py-16">
        <div className="max-w-2xl lg:max-w-5xl w-full landing-rise">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div
              className="lg:order-2 rounded-xl overflow-hidden"
              style={{
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <Image
                src="/hero.png"
                alt="Heart of Gold spaceship with a Claude Code terminal as its viewport"
                width={1920}
                height={960}
                priority
                className="w-full h-auto block"
              />
            </div>
            <div className="lg:order-1">
              <p
                className="text-xs uppercase tracking-[0.2em] mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                {m.landing.eyebrow}
              </p>
              <h1
                className="text-4xl md:text-5xl font-semibold leading-[1.05] mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                {m.landing.title}
              </h1>
              <p
                className="text-base sm:text-lg leading-relaxed mb-6 sm:mb-8"
                style={{ color: "var(--text-secondary)" }}
              >
                {m.landing.lede}
              </p>

              <div className="flex items-center gap-4">
                <LandingCta
                  href={`/${validLocale}/lab`}
                  label={m.landing.cta}
                />
              </div>
            </div>
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
