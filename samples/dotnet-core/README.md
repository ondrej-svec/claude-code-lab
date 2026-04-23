# dotnet-core sample

Minimal ASP.NET Core Web API. Hands-on sample for the C# / .NET track of the claude-code-lab guide.

## Requirements

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or newer
  - macOS: `brew install --cask dotnet-sdk`
  - Linux: follow the Microsoft package instructions
  - Windows: download installer

## Run

```bash
dotnet run
```

Server listens on http://localhost:5100.

```bash
curl http://localhost:5100/api/items
# [{"id":1,"name":"Onboarding checklist"}, ...]
```

## Project layout

```
.
├── Program.cs                  # Everything — endpoints, DI, record types, in-memory store
├── CCLab.Sample.csproj         # Target net8.0, minimal API
├── appsettings.json            # Kestrel port config
├── CLAUDE.md                   # Per-project context for Claude Code
└── .claudeignore               # Don't send bin/, obj/ to Claude
```

## Why this stack?

Teams running .NET 4.8 WinForms are Windows-only and hard to practice on from a Mac. This cross-platform sample keeps the language (C#) and runtime shape (ASP.NET Core, DI, record types, endpoints) but runs on every OS. The workflow you practice here transfers directly.

## Guide chapters that use this sample

- [Chapter 2 — Your first task](../../content/en/first-task.mdx)
- [Chapter 3 — Teach Claude your project](../../content/en/teach-claude-your-project.mdx)
