# CLAUDE.md — dotnet-core sample

## Project
Minimal ASP.NET Core Web API. Cross-platform (runs on macOS, Linux, Windows via `dotnet` CLI). Intentionally tiny — one endpoint family (`/api/items`), one in-memory store. Used as a hands-on sample for the claude-code-lab workshop.

## Conventions
- .NET 8 minimal API style (no controllers, everything in `Program.cs` until it hurts).
- Records for DTOs.
- One file until complexity warrants splitting.
- `var` preferred when type is obvious from the right-hand side.

## Run
- `dotnet run` — serves on http://localhost:5100
- `dotnet build` — compile only
- `dotnet test` — when you add tests

## Don't
- Don't add Entity Framework yet. `ItemStore` is deliberately in-memory for teaching.
- Don't introduce controllers — this is minimal API on purpose.
- Don't add auth — not the point of this sample.

## Ideas for the lab
- Ask Claude to add a `DELETE /api/items/{id}` endpoint.
- Ask Claude to write an integration test for the GET endpoint.
- Ask Claude to refactor `ItemStore` to use a `ConcurrentDictionary`.
