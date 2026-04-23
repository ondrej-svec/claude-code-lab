import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "./lib/i18n";

const LOCALE_COOKIE = "cc-lab-locale";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const firstSegment = pathname.split("/")[1] ?? "";

  // Root or missing locale → redirect to the detected locale
  // (Accept-Language first, cookie second, default third).
  if (!isLocale(firstSegment)) {
    const locale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, locale, { path: "/", sameSite: "lax" });
    return response;
  }

  // Pass the locale to RSC layouts via a request header.
  const headers = new Headers(request.headers);
  headers.set("x-locale", firstSegment);

  const response = NextResponse.next({ request: { headers } });
  if (request.cookies.get(LOCALE_COOKIE)?.value !== firstSegment) {
    response.cookies.set(LOCALE_COOKIE, firstSegment, {
      path: "/",
      sameSite: "lax",
    });
  }
  return response;
}

function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const acceptLanguage = request.headers.get("accept-language")?.toLowerCase() ?? "";
  for (const locale of LOCALES) {
    if (
      acceptLanguage.startsWith(locale) ||
      acceptLanguage.includes(`,${locale}`) ||
      acceptLanguage.includes(`;${locale}`)
    ) {
      return locale;
    }
  }
  return DEFAULT_LOCALE;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*opengraph-image.*|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf)).*)",
  ],
};
