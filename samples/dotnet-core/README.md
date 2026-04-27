# The Guide — dotnet-core sample

The .NET twin of the python-react Guide sample. ASP.NET Core minimal API, in-memory store, six seeded entries (three EN, three CS). On the first run, `dotnet run` greets you with a Sub-Etha boot sequence in your terminal — typed lines, a "DON'T PANIC" banner, and one entry rendered as a styled panel — before starting the API. Subsequent runs print one calm line and start straight away.

## Requirements

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or newer
  - macOS: `brew install --cask dotnet-sdk`
  - Linux: follow the Microsoft package instructions
  - Windows: download the installer

## Run

```bash
dotnet run
```

First run: boot sequence renders, then the API starts on `http://localhost:5100`. A `.guide-booted` marker file gets written to the working directory.

Subsequent runs: one line — `Sub-Etha relay online · http://localhost:5100` — then the API. To replay the boot, delete the marker:

```bash
rm .guide-booted && dotnet run
```

## Test it

```bash
curl http://localhost:5100/api/entries
# Six seeded entries (3 EN, 3 CS).

curl "http://localhost:5100/api/entries?locale=cs"
# Just the CS entries.

curl http://localhost:5100/api/entries/2
# The Babel Fish.
```

## API shape

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/api/entries` | Optional `?locale=en\|cs` filter |
| `GET` | `/api/entries/{id}` | 404 if missing |
| `POST` | `/api/entries` | Body: `{title, body, badge?, contributor?, locale?, tags?}` |

`PUT` and `DELETE` are not shipped — adding `DELETE` is a chapter exercise. See `CLAUDE.md`.

The shape mirrors the python-react sample exactly, so chapter exercises that target the API work on either stack.

## Project layout

```
.
├── Program.cs                  # Entrypoint: boot logic + 3 endpoints
├── Models/
│   └── Entry.cs                # Entry record + EntryInput request shape
├── Stores/
│   └── EntryStore.cs           # In-memory store, seeded with 6 entries
├── Boot/
│   └── BootSequence.cs         # Cinematic first-run terminal boot
├── CCLab.Sample.csproj         # net8.0 minimal API + Spectre.Console
├── appsettings.json            # Kestrel port config
├── CLAUDE.md                   # Per-project context for Claude Code
├── .claudeignore               # bin/, obj/ excluded
└── .gitignore                  # adds .guide-booted to project ignores
```

## Why Spectre.Console

The boot sequence needs colored terminal output (a panel with a glow border, a styled banner, properly aligned typed lines) without 80 lines of fragile escape-string formatting. Spectre.Console gives us `Panel`, `Rule`, and `Markup` with one dependency. The runtime cost is nothing for the API — it's only used at startup.

## Why this stack?

Teams running .NET 4.8 WinForms are Windows-only and hard to practice on from a Mac. This cross-platform sample keeps the language (C#) and runtime shape (ASP.NET Core, DI, record types, endpoints) but runs on every OS. The workflow you practice here transfers directly.

## Guide chapters that use this sample

- [Chapter 2 — Your first task](../../content/en/first-task.mdx) — add `DELETE /api/entries/{id}`.
- [Chapter 3 — Teach Claude your project](../../content/en/teach-claude-your-project.mdx) — refine `CLAUDE.md` so Claude understands the Entry domain.
