# Security Policy

This repository is a static Next.js guide with two sample projects. The attack surface is small, but if you find something worth reporting, here's how.

## Reporting a vulnerability

1. **Don't open a public issue.**
2. Use [GitHub's private vulnerability reporting](https://github.com/ondrej-svec/claude-code-lab/security/advisories/new) on this repository.
3. Include what you observed, how to reproduce it, and what you think the impact is.

I aim to acknowledge reports within 48 hours. Severity-dependent, but a fix or mitigation plan within a week for anything real.

## Scope

In scope:

- The guide site at [cc-lab.ondrejsvec.com](https://cc-lab.ondrejsvec.com) and the Next.js app that produces it (`app/`).
- The companion skill in `skill/` and the capture scripts in `scripts/`.
- The sample projects in `samples/dotnet-core/` and `samples/python-react/` — these are intentionally minimal and meant to be run locally by workshop participants. Flag real vulnerabilities, but "the sample doesn't have auth" is the point.

Out of scope:

- Claude Code itself — report those to Anthropic.
- Third-party dependencies — report upstream first; I'll pull the fix in.

## What I don't do

- Run a bug bounty program.
- Make CVE-grade guarantees about uptime or response SLAs.

It's a single-maintainer educational repo. Treat it like one.
