import type { Metadata } from "next";
import { headers } from "next/headers";
import { Manrope, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "./components/theme-provider";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import "./globals.css";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Claude Code Lab",
  description:
    "A practice for developers working with agents — from first command to compound.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headerStore = await headers();
  const headerLocale = headerStore.get("x-locale");
  const lang = isLocale(headerLocale) ? headerLocale : DEFAULT_LOCALE;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
