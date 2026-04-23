"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();

  return (
    <div
      className="flex items-center gap-1.5 text-xs"
      style={{ color: "var(--text-muted)" }}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((locale) => {
        const segments = pathname.split("/");
        segments[1] = locale;
        const href = segments.join("/") || `/${locale}`;
        const active = locale === currentLocale;
        return (
          <Link
            key={locale}
            href={href}
            prefetch={false}
            className="uppercase transition"
            style={{
              color: active ? "var(--text-primary)" : "var(--text-muted)",
            }}
            aria-current={active ? "page" : undefined}
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}
