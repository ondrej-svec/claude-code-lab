import { useState } from "react";
import type { Entry, Locale } from "../types";
import { createEntry } from "../api";

const COPY: Record<Locale, {
  heading: string;
  titlePh: string;
  bodyPh: string;
  contributorPh: string;
  submit: string;
  errorPrefix: string;
}> = {
  en: {
    heading: "Add an entry",
    titlePh: "Title",
    bodyPh: "What's the story?",
    contributorPh: "Your name (optional)",
    submit: "Submit to the Guide",
    errorPrefix: "Could not save",
  },
  cs: {
    heading: "Přidat záznam",
    titlePh: "Název",
    bodyPh: "O co jde?",
    contributorPh: "Tvé jméno (volitelné)",
    submit: "Odeslat do Průvodce",
    errorPrefix: "Nepodařilo se uložit",
  },
};

export function NewEntryForm({
  locale,
  onCreated,
}: {
  locale: Locale;
  onCreated: (entry: Entry) => void;
}) {
  const c = COPY[locale];
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [contributor, setContributor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = title.trim().length > 0 && body.trim().length > 0 && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const created = await createEntry({
        title: title.trim(),
        body: body.trim(),
        badge: "unknown",
        contributor: contributor.trim() || (locale === "cs" ? "Anonymní" : "Anonymous"),
        locale,
        tags: [],
      });
      onCreated(created);
      setTitle("");
      setBody("");
      setContributor("");
    } catch (err) {
      setError(`${c.errorPrefix}: ${String(err)}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="new-entry" onSubmit={handleSubmit}>
      <div className="new-entry__title">{c.heading}</div>
      <div className="new-entry__row">
        <input
          className="new-entry__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={c.titlePh}
          aria-label={c.titlePh}
        />
      </div>
      <div className="new-entry__row">
        <textarea
          className="new-entry__textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={c.bodyPh}
          aria-label={c.bodyPh}
        />
      </div>
      <div className="new-entry__row">
        <input
          className="new-entry__input"
          value={contributor}
          onChange={(e) => setContributor(e.target.value)}
          placeholder={c.contributorPh}
          aria-label={c.contributorPh}
        />
      </div>
      <button type="submit" className="new-entry__submit" disabled={!canSubmit}>
        {c.submit}
      </button>
      {error && (
        <div className="new-entry__error" role="alert">
          {error}
        </div>
      )}
    </form>
  );
}
