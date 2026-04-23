# Pre-session email — Iresoft Group workshop

Draft. Send 48h before the session (so: Saturday 2026-04-25). Prefer Czech for Iresoft; EN version below for reference.

---

## Czech version

**Předmět:** Claude Code workshop — pondělí 15:00 — co si připravit

Ahoj,

v pondělí 2026-04-27 v 15:00 budeme mít 60 min hands-on session s Claude Code. Abychom ten čas využili, je potřeba si pár věcí připravit dopředu.

**Co si udělej do pondělního rána:**

1. **Nainstaluj Claude desktop aplikaci** — [claude.ai/download](https://claude.ai/download). Funguje na Macu, Windows i Linuxu. Desktop aplikace obsahuje Claude Code jako integrovaný workspace, nic dalšího instalovat nemusíš.
2. **Přihlas se a ověř, že ti aplikace běží.** Přihlas se přes Google nebo mail.
3. **Pokud jedeš na firemním stroji**, ověř si s IT, že instalace projde. Některé firmy mají allow-list binárek.

**Doprovodný lab:**

Průvodce pro workshop jsme postavili jako web. Použij ho během session i potom. Funguje na mobilu.

URL: https://claude-code-lab-nine.vercel.app  
Heslo: `iresoft-2026`

Máš tam sedm kapitol s kódem, který si můžeš hned zkoušet. První čtyři projdeme společně, zbytek je reference pro samostatné tempo během týdne.

**Ukázkové projekty:**

Během session budeme pracovat na ukázkovém kódu. Naklonuj si repo předem:

```bash
git clone https://github.com/ondrej-svec/claude-code-lab.git
```

- **Alveno** (Python + React) — použijeme `samples/python-react/`
- **CYGNUS** (.NET) — použijeme `samples/dotnet-core/` (cross-platform, běží i na Macu). Pokud ještě nemáš .NET SDK, `brew install --cask dotnet-sdk` nebo [stáhni z microsoft.com](https://dotnet.microsoft.com/download/dotnet/8.0).

**Co nebudeme dělat:**

- Nebudeme pracovat nad vaším produkčním kódem. CYGNUS má firemní omezení na AI nad codebase; to ctíme. Všechno si zkusíš na sample projektech, které pak můžeš bezpečně použít jako playground.

**Pokud něco nepůjde:**

- Neměj stres, během session si to vyřešíme
- Preemptivně: `pnpm` a `node --version` (pro Alveno), `dotnet --version` (pro CYGNUS) by měly odpovídat

Pondělí v 15:00 se uvidíme.

Ondra

---

## English version

**Subject:** Claude Code workshop — Monday 15:00 — what to prepare

Hi,

Monday 2026-04-27 at 15:00 CET, we have a 60-minute hands-on Claude Code session. To make the time count, a few things to do ahead of time.

**Before Monday morning:**

1. **Install the Claude desktop app** — [claude.ai/download](https://claude.ai/download). Works on macOS, Windows, and Linux. The desktop app includes Claude Code as a built-in workspace — nothing else to install.
2. **Sign in and verify the app runs.** Google or email auth.
3. **On a corporate machine?** Check with IT that the install passes. Some companies allow-list binaries.

**Companion guide:**

Built as a web app. Use it during the session and after. Works on mobile.

URL: https://claude-code-lab-nine.vercel.app  
Password: `iresoft-2026`

Seven chapters with runnable code samples. We'll walk through the first four together; the rest is reference for your own pace through the week.

**Sample projects:**

During the session we'll work on sample code. Clone the repo ahead of time:

```bash
git clone https://github.com/ondrej-svec/claude-code-lab.git
```

- **Alveno** (Python + React) — we'll use `samples/python-react/`
- **CYGNUS** (.NET) — we'll use `samples/dotnet-core/` (cross-platform, runs on Mac too). If you don't have the .NET SDK yet: `brew install --cask dotnet-sdk` or [download from microsoft.com](https://dotnet.microsoft.com/download/dotnet/8.0).

**What we won't do:**

- We won't work on your production code. CYGNUS has corporate restrictions on AI over production codebases; we respect that. Everything will happen on sample projects you can safely use as a playground afterward.

**If something breaks:**

- Don't stress, we'll sort it during the session
- Pre-check: `pnpm` and `node --version` (Alveno), `dotnet --version` (CYGNUS) should respond

See you Monday at 15:00.

Ondra

---

## Notes for the sender

- **Password** is `iresoft-2026`. Rotate in Vercel dashboard after the workshop if you want. Set via: `vercel env add WORKSHOP_PASSWORD production`.
- **URL** is currently `claude-code-lab-nine.vercel.app` (the `-nine` suffix was auto-assigned because `claude-code-lab.vercel.app` was taken). If you add a custom domain like `cc-lab.ondrejsvec.com`, update the email.
- **Attachments:** not needed. All info is in the email body and the guide.
- **Reply-to:** set to the person who'll handle pre-session questions (Ondra or Filip).
