import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <>{children}</>;
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "cs" }];
}
