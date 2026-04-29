# CLAUDE.md — The Guide (dotnet-core sample)

## Project

The Guide is a small bilingual knowledge-base app for the cc-lab workshop, styled as the in-universe *Hitchhiker's Guide to the Galaxy*. ASP.NET Core minimal API, in-memory store, no API keys, no external services. The first run plays a terminal boot sequence powered by Spectre.Console.

This is the .NET twin of `samples/python-react/`. The two samples expose the same `/api/entries` shape so chapter exercises work on either stack.

The sample is **deliberately partial**: chapter exercises grow it. Don't add features outside the requested change.

## Layout

- `Program.cs` — minimal API entrypoint, three endpoints, first-run boot logic.
- `Models/Entry.cs` — `Entry` record + `EntryInput` request shape.
- `Stores/EntryStore.cs` — in-memory list seeded with six entries.
- `Boot/BootSequence.cs` — cinematic terminal boot using Spectre.Console.

## Domain

Every record is an `Entry`:

| Field | Type | Notes |
| --- | --- | --- |
| `Id` | int | Server-assigned. Serialized as `id`. |
| `Title` | string | Required. |
| `Body` | string | Plain text in Phase 1. Markdown rendering in a later chapter. |
| `Badge` | string | One of `mostly-harmless`, `mostly-dangerous`, `unknown`. |
| `Contributor` | string | Defaults to "Anonymous". |
| `CreatedAt` | string | ISO 8601, server-assigned. |
| `Locale` | string | `en` or `cs`. |
| `Tags` | string[] | Bounded at 10 items, 20 chars each by `EntryStore.Add`. |

JSON serialization uses `JsonNamingPolicy.CamelCase`, so over the wire the fields are `id`, `title`, `body`, `badge`, etc. — matching the python-react sample exactly.

Endpoints currently shipped:

- `GET /api/entries[?locale=en|cs]`
- `GET /api/entries/{id}`
- `POST /api/entries`

`PUT` and `DELETE` are **deliberately absent** — chapter 2 of the lab adds `DELETE`. Don't add them on a request that doesn't ask for them.

## Conventions

- **.NET 8 minimal API** — no controllers, endpoints registered in `Program.cs`.
- **Records for DTOs** — `Entry` and `EntryInput` are records, not classes.
- **One file per concern** — `Program.cs` stays the API definition, model + store + boot live in their own folders.
- **`var` preferred** when type is obvious from the right-hand side.
- **Bilingual seed data** — three EN + three CS entries with locale-appropriate (not parallel-translation) content.

## Voice rules (apply to in-app strings, error messages, log lines)

These mirror `docs/cc-lab-design-system.md`:

- Quietly confident, peer-to-peer, no bullshit.
- Forbidden: "let's", "leverage", "exciting", "amazing", "delve", "dive deep".
- One line of copy per surface.
- No decorative emoji.

## Don't

- Don't add Entity Framework. In-memory `EntryStore` is deliberate.
- Don't introduce controllers. This is minimal API on purpose.
- Don't add auth.
- Don't make outbound network calls in the seed. **Zero API keys** for first-run.
- Don't add `PUT` or `DELETE` unprompted — they're chapter exercises.
- Don't replace Spectre.Console. The boot needs it; everything else can be plain `Console.WriteLine`.

## First-run boot

`BootSequence.Play()` runs once on `dotnet run` if `.guide-booted` doesn't exist in the working directory. After the boot, the marker is written. To replay: `rm .guide-booted && dotnet run`.

The boot is permitted under the "Cinematic moments" exception in `docs/cc-lab-design-system.md`: one-shot, dismissible (Ctrl-C), narratively meaningful. Don't extend it — keep it under three seconds total.

## Ideas for the lab

(These are exercises participants run during cc-lab chapters. Don't run them unprompted.)

- **Chapter 2 — first task**: add `DELETE /api/entries/{id}`.
- **Chapter 3 — teach Claude**: extend this CLAUDE.md so Claude knows the badge rules and voice constraints.
- Add input validation: empty title, max body length, allowed tags.
- Refactor `EntryStore` to use a `ConcurrentDictionary`.
- Add a `PATCH` endpoint for editing.
- Persist entries to SQLite via `Microsoft.Data.Sqlite`.
- Add an integration test using `WebApplicationFactory<Program>`.
