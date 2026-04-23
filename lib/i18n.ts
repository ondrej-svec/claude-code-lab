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
  nav: {
    language: string;
    theme: string;
  };
};

export const messages: Record<Locale, Messages> = {
  en: {
    landing: {
      eyebrow: "Claude Code · a practice",
      title: "A practice for developers working with agents.",
      lede: "Install Claude. Give it context. Iterate with discipline. Build the reusable patterns that compound. Start here.",
      cta: "Enter the lab",
      ctaHint: "",
      footer: "Rosé Pine theme · Built with Claude Code",
    },
    nav: {
      language: "Language",
      theme: "Theme",
    },
  },
  cs: {
    landing: {
      eyebrow: "Claude Code · praxe",
      title: "Praxe pro vývojáře pracující s agenty.",
      lede: "Nainstaluj Claude. Dej mu kontext projektu. Iteruj s rozmyslem. Postav si skilly a pluginy, ke kterým se budeš vracet. Začni tady.",
      cta: "Vstoupit do labu",
      ctaHint: "",
      footer: "Rosé Pine theme · Built with Claude Code",
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
