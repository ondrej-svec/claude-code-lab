import Link from "next/link";
import { ThemeSwitcher } from "@/app/components/theme-switcher";
import { LanguageSwitcher } from "@/app/components/language-switcher";
import { DEFAULT_LOCALE, getMessages, isLocale } from "@/lib/i18n";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { locale } = await params;
  const { error, next } = await searchParams;
  const validLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const m = getMessages(validLocale);
  const nextPath = next && next.startsWith("/") ? next : `/${validLocale}`;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--surface)" }}
    >
      <header className="flex items-center justify-between px-8 py-6 max-w-5xl mx-auto w-full">
        <Link
          href={`/${validLocale}`}
          className="text-sm tracking-wide motion-link"
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-display)",
          }}
        >
          claude-code-lab
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLocale={validLocale} />
          <ThemeSwitcher />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="max-w-md w-full landing-rise">
          <h1
            className="text-3xl md:text-4xl font-semibold leading-[1.1] mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            {m.login.title}
          </h1>
          <p
            className="text-base leading-relaxed mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            {m.login.lede}
          </p>

          <form
            action="/api/login"
            method="post"
            className="flex flex-col gap-4"
          >
            <input type="hidden" name="locale" value={validLocale} />
            <input type="hidden" name="next" value={nextPath} />

            <label
              className="flex flex-col gap-2 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>{m.login.passwordLabel}</span>
              <input
                type="password"
                name="password"
                required
                autoFocus
                placeholder={m.login.passwordPlaceholder}
                className="w-full px-4 py-3 rounded-lg text-base outline-none"
                style={{
                  background: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </label>

            {error === "invalid" && (
              <p
                className="text-sm"
                role="alert"
                style={{ color: "var(--danger)" }}
              >
                {m.login.invalid}
              </p>
            )}

            <button
              type="submit"
              className="motion-button inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium mt-2"
              style={{
                background: "var(--accent-surface)",
                color: "var(--accent-text)",
              }}
            >
              {m.login.submit}
            </button>

            <p
              className="text-xs mt-2"
              style={{ color: "var(--text-muted)" }}
            >
              {m.login.hint}
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
