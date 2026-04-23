export const LOCALES = ["en", "cs"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string | undefined | null): value is Locale {
  return LOCALES.includes(value as Locale);
}

export type Messages = {
  landing: {
    eyebrow: string;
    title: string;
    lede: string;
    cta: string;
    ctaHint: string;
    footer: string;
  };
  login: {
    title: string;
    lede: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    submit: string;
    invalid: string;
    hint: string;
  };
  nav: {
    language: string;
    theme: string;
  };
};

export const messages: Record<Locale, Messages> = {
  en: {
    landing: {
      eyebrow: "Workshop · Iresoft Group · April 2026",
      title: "A practice for developers working with agents.",
      lede: "Install once. Teach your project. Iterate with discipline. Build the reusable patterns that multiply your output. This lab takes you from first command to compound.",
      cta: "Enter the lab",
      ctaHint: "password required",
      footer: "Rosé Pine · Harness Lab design system",
    },
    login: {
      title: "Enter the lab",
      lede: "The workshop password was shared ahead of the session.",
      passwordLabel: "Password",
      passwordPlaceholder: "workshop password",
      submit: "Unlock",
      invalid: "Wrong password.",
      hint: "If you don't have it, check the pre-session email.",
    },
    nav: {
      language: "Language",
      theme: "Theme",
    },
  },
  cs: {
    landing: {
      eyebrow: "Workshop · Iresoft Group · duben 2026",
      title: "Praktická cesta pro vývojáře, kteří pracují s agenty.",
      lede: "Nainstaluj. Nauč svůj projekt. Iteruj s disciplínou. Postav si patterny, které tvoji práci násobí. Lab tě vede od prvního příkazu až k fázi, kdy se ti práce začíná skládat sama na sebe.",
      cta: "Vstoupit do labu",
      ctaHint: "vyžaduje heslo",
      footer: "Rosé Pine · Harness Lab design system",
    },
    login: {
      title: "Vstoupit do labu",
      lede: "Heslo jsme poslali v e‑mailu před sessionou.",
      passwordLabel: "Heslo",
      passwordPlaceholder: "heslo k workshopu",
      submit: "Odemknout",
      invalid: "Špatné heslo.",
      hint: "Pokud ho nemáš, mrkni do předsession mailu.",
    },
    nav: {
      language: "Jazyk",
      theme: "Režim",
    },
  },
};

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
