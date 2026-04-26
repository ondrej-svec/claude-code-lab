# cc-lab plugin — bundled knowledge

The chapter content + design system shipped with the `cc-lab` plugin.
Read by the `cc-lab-judge` subagent so observations from
`/cc-lab-diagnose` come from a reader who has actually read every
chapter, not just pattern-matched against rules.

## Layout

```
knowledge/
├── README.md                         this file
├── cc-lab-design-system.md           voice + visual rules
└── chapters/
    ├── en/<slug>.mdx                 10 chapters, EN canonical
    └── cs/<slug>.mdx                 10 chapters, CS peer-voiced
```

## Why bundle vs fetch at runtime

Bundling means `/cc-lab-diagnose` works offline and is
version-pinned. The trade-off: bundled content can drift from the
live site between releases. The `scripts/sync-plugin-knowledge.sh`
script + `feedback_plugin_versioning.md`'s "bump on toolkit changes"
rule keep drift bounded — every meaningful chapter change ships in a
new plugin version.

## Updating bundled content

Bundled chapters live alongside the source they're copied from
(`content/en/*.mdx`, `content/cs/*.mdx`, `docs/cc-lab-design-system.md`)
in this same repo. Run the sync script after any chapter edit:

```bash
bash scripts/sync-plugin-knowledge.sh
```

The script copies the source files into `plugins/cc-lab/knowledge/`
and prints what changed. Then bump `plugins/cc-lab/.claude-plugin/plugin.json`
and `.claude-plugin/marketplace.json` versions per
`feedback_plugin_versioning.md`.

Without the sync, `/cc-lab-diagnose` ships with stale references
relative to the live site — fine for short windows, painful past one
plugin version.

## What the agent does with this content

`cc-lab-judge` (in `plugins/cc-lab/agents/cc-lab-judge.md`) reads:

- The relevant chapter for each rubric category (e.g., chapter 4 for
  permission modes, chapter 6 for permission rules)
- The design system, to ensure observations match lab voice
- Specific paragraphs to quote when an observation needs a citation
  rather than a vague "Read more"

The judge then returns observations grounded in chapter content,
which is the difference between "consider adding hooks for this" and
"chapter 6 says 'from now on do X' is a hook, not a memory — your
CLAUDE.md:42 is exactly that pattern, here's the hook."
