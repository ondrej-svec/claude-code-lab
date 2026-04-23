import Link from "next/link";
import { ThemeSwitcher } from "./components/theme-switcher";

export default function Home() {
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
        <ThemeSwitcher />
      </header>

      <main className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="max-w-2xl w-full landing-rise">
          <p
            className="text-xs uppercase tracking-[0.2em] mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Workshop · Iresoft Group · April 2026
          </p>
          <h1
            className="text-5xl md:text-6xl font-semibold leading-[1.05] mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            From ChatGPT in the browser to Claude Code in your terminal.
          </h1>
          <p
            className="text-lg leading-relaxed mb-10"
            style={{ color: "var(--text-secondary)" }}
          >
            A hands-on lab that takes you from install to{" "}
            <em>compound</em> — the state where your agent writes the skill,
            which writes the plugin, which writes the next plugin.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="motion-button inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium"
              style={{
                background: "var(--accent-surface)",
                color: "var(--accent-text)",
              }}
            >
              Enter the lab
            </Link>
            <span
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              password required
            </span>
          </div>
        </div>
      </main>

      <footer
        className="px-8 py-6 max-w-5xl mx-auto w-full text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        Built with Claude Code · Rosé Pine · Harness Lab design system
      </footer>
    </div>
  );
}
