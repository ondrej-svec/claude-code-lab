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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Claude Code Lab",
  description:
    "A practice for developers working with agents — from first command to compound.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
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
