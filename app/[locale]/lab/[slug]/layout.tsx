import type { ReactNode } from "react";
import { ChapterSidebar } from "@/app/components/chapter-sidebar";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export default async function ChapterLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const validLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;

  return (
    <div className="grid gap-10 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)_200px]">
      <aside className="md:sticky md:top-10 h-fit">
        <ChapterSidebar locale={validLocale} currentSlug={slug} />
      </aside>
      {children}
    </div>
  );
}
