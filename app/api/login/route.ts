import { NextResponse } from "next/server";
import { AUTH_COOKIE, AUTH_TTL_SECONDS, signAuthToken } from "@/lib/auth";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const locale = String(formData.get("locale") ?? DEFAULT_LOCALE);
  const next = String(formData.get("next") ?? "/");

  const expected = process.env.WORKSHOP_PASSWORD;
  const secret = process.env.COOKIE_SECRET;

  if (!expected || !secret) {
    return NextResponse.json(
      { error: "Workshop password not configured" },
      { status: 500 },
    );
  }

  if (password !== expected) {
    const fallbackLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
    const redirect = new URL(`/${fallbackLocale}/login?error=invalid`, request.url);
    return NextResponse.redirect(redirect, 303);
  }

  const token = await signAuthToken(password, secret);
  const redirect = new URL(next.startsWith("/") ? next : "/", request.url);
  const response = NextResponse.redirect(redirect, 303);
  response.cookies.set(AUTH_COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: AUTH_TTL_SECONDS,
  });
  return response;
}
