import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "./lib/i18n";
import { AUTH_COOKIE, LOCALE_COOKIE, verifyAuthToken } from "./lib/auth";

const PUBLIC_PATHS = ["/login"] as const;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const firstSegment = pathname.split("/")[1] ?? "";
  const locale: Locale = isLocale(firstSegment) ? firstSegment : detectLocale(request);

  // Root or missing locale: redirect to the detected locale with original path preserved.
  if (!isLocale(firstSegment)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, locale, { path: "/", sameSite: "lax" });
    return response;
  }

  const withoutLocale = pathname.slice(`/${locale}`.length) || "/";
  const isPublic = PUBLIC_PATHS.some((p) => withoutLocale === p || withoutLocale.startsWith(`${p}/`));

  if (!isPublic) {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    const valid = await verifyAuthToken(
      token,
      process.env.WORKSHOP_PASSWORD,
      process.env.COOKIE_SECRET,
    );
    if (!valid) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Pass locale to RSC via request header so layouts can read it.
  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);

  const response = NextResponse.next({ request: { headers } });
  // Persist locale preference for future direct hits.
  if (request.cookies.get(LOCALE_COOKIE)?.value !== locale) {
    response.cookies.set(LOCALE_COOKIE, locale, { path: "/", sameSite: "lax" });
  }
  return response;
}

function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const acceptLanguage = request.headers.get("accept-language")?.toLowerCase() ?? "";
  for (const locale of LOCALES) {
    if (acceptLanguage.startsWith(locale) || acceptLanguage.includes(`,${locale}`) || acceptLanguage.includes(`;${locale}`)) {
      return locale;
    }
  }
  return DEFAULT_LOCALE;
}

export const config = {
  matcher: [
    // Excluded from the auth + locale proxy:
    // - /api (login endpoint + future api routes)
    // - Next.js internals: _next/static, _next/image
    // - Static asset extensions (images, fonts)
    // - /opengraph-image at any depth so social previews work unauthenticated
    "/((?!api|_next/static|_next/image|favicon.ico|.*opengraph-image.*|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf)).*)",
  ],
};
