export type Badge = "mostly-harmless" | "mostly-dangerous" | "unknown";
export type Locale = "en" | "cs";

export type Entry = {
  id: number;
  title: string;
  body: string;
  badge: Badge;
  contributor: string;
  created_at: string;
  locale: Locale;
  tags: string[];
};

export type EntryInput = {
  title: string;
  body: string;
  badge: Badge;
  contributor: string;
  locale: Locale;
  tags: string[];
};
