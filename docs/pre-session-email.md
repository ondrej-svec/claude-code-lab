# Pre-session email — workshop template

A draft template for the email you send 48h before a Claude Code workshop. Fill in the `{placeholders}` and adapt per audience. Both Czech and English variants below.

---

## Czech version

**Předmět:** Claude Code workshop — {den a čas} — co si připravit

Ahoj,

{den a čas} budeme mít {délka} hands-on session s Claude Code. Abychom ten čas využili, je potřeba si pár věcí připravit dopředu.

**Co si udělej do {dne}:**

1. **Nainstaluj Claude desktop aplikaci** — [claude.ai/download](https://claude.ai/download). Funguje na Macu, Windows i Linuxu. Desktop aplikace obsahuje Claude Code jako integrované prostředí, nic dalšího instalovat nemusíš.
2. **Přihlas se a ověř, že ti aplikace běží.** Přihlášení přes Google nebo mail.
3. **Pokud jedeš na firemním stroji**, ověř si s IT, že instalace projde. Některé firmy mají allow-list binárek.

**Doprovodný lab:**

Průvodce pro workshop žije na webu. Použij ho během session i potom. Funguje i na mobilu.

URL: https://claude-code-lab-nine.vercel.app

Je tam devět kapitol s runnable ukázkami. První čtyři projdeme společně, zbytek je reference pro samostatné tempo během týdne.

**Ukázkové projekty:**

Během session budeme pracovat na ukázkovém kódu. Naklonuj si repo předem:

```bash
git clone https://github.com/ondrej-svec/claude-code-lab.git
```

- **Python / JS** — použijeme `samples/python-react/` (FastAPI + Vite)
- **C# / .NET** — použijeme `samples/dotnet-core/` (cross-platform ASP.NET Core, běží i na Macu). Pokud ještě nemáš .NET SDK: `brew install --cask dotnet-sdk` nebo [stáhni z microsoft.com](https://dotnet.microsoft.com/download/dotnet/8.0).

**Co nebudeme dělat:**

- Nebudeme pracovat nad vaším produkčním kódem. Pokud máte firemní omezení na AI nad codebase, ctíme to. Všechno si zkusíš na sample projektech, které pak můžeš bezpečně použít jako playground.

**Pokud něco nepůjde:**

- Neměj stres, během session si to vyřešíme
- Preemptivně: `pnpm` a `node --version` pro Python/JS, `dotnet --version` pro .NET

{den a čas} se uvidíme.

Ondra

---

## English version

**Subject:** Claude Code workshop — {date and time} — what to prepare

Hi,

{date and time} we have a {duration} hands-on Claude Code session. To make the time count, a few things to do ahead of time.

**Before {day}:**

1. **Install the Claude desktop app** — [claude.ai/download](https://claude.ai/download). Works on macOS, Windows, and Linux. The desktop app includes Claude Code as a built-in workspace — nothing else to install.
2. **Sign in and verify the app runs.** Google or email auth.
3. **On a corporate machine?** Check with IT that the install passes. Some companies allow-list binaries.

**Companion guide:**

Built as a web app. Use it during the session and after. Works on mobile.

URL: https://claude-code-lab-nine.vercel.app

Nine chapters with runnable code samples. We'll walk through the first four together; the rest is reference for your own pace through the week.

**Sample projects:**

During the session we'll work on sample code. Clone the repo ahead of time:

```bash
git clone https://github.com/ondrej-svec/claude-code-lab.git
```

- **Python / JS** — we'll use `samples/python-react/` (FastAPI + Vite)
- **C# / .NET** — we'll use `samples/dotnet-core/` (cross-platform ASP.NET Core, runs on Mac too). If you don't have the .NET SDK yet: `brew install --cask dotnet-sdk` or [download from microsoft.com](https://dotnet.microsoft.com/download/dotnet/8.0).

**What we won't do:**

- We won't work on your production code. If your org restricts AI over production codebases, we respect that. Everything happens on sample projects you can safely use as a playground afterward.

**If something breaks:**

- Don't stress, we'll sort it during the session
- Pre-check: `pnpm` and `node --version` for Python/JS, `dotnet --version` for .NET

See you {day} at {time}.

Ondra

---

## Notes for the sender

- **URL** is currently `claude-code-lab-nine.vercel.app` (auto-assigned; `claude-code-lab.vercel.app` was taken). Update the email if you add a custom domain like `cc-lab.ondrejsvec.com`.
- **Reply-to:** set to whoever handles pre-session questions.
- **Placeholders to fill:** date, time, day, duration. Optionally add workshop-specific context (company name, team split, etc.) in an intro paragraph.
