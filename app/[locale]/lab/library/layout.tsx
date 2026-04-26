import type { ReactNode } from "react";
import { ChapterSidebar } from "@/app/components/chapter-sidebar";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export default async function LibraryLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;

  return (
    <div className="grid gap-10 md:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="md:sticky md:top-10 h-fit">
        <ChapterSidebar locale={validLocale} currentSection="library" />
      </aside>
      {children}
    </div>
  );
}
