import type { Entry, EntryInput, Locale } from "./types";

export async function listEntries(locale?: Locale): Promise<Entry[]> {
  const url = locale ? `/api/entries?locale=${locale}` : "/api/entries";
  const r = await fetch(url);
  if (!r.ok) throw new Error(`listEntries failed: ${r.status}`);
  return (await r.json()) as Entry[];
}
// Note: api.ts keeps the optional-locale form for callers that genuinely
// don't have one. App.tsx always has a locale, so it inlines the URL.

export async function getEntry(id: number): Promise<Entry> {
  const r = await fetch(`/api/entries/${id}`);
  if (!r.ok) throw new Error(`getEntry(${id}) failed: ${r.status}`);
  return (await r.json()) as Entry;
}

export async function createEntry(input: EntryInput): Promise<Entry> {
  const r = await fetch("/api/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!r.ok) throw new Error(`createEntry failed: ${r.status}`);
  return (await r.json()) as Entry;
}
