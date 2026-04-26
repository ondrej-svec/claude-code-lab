# cc-lab-diagnose example outputs

This directory will hold redacted example outputs from real
diagnostic runs, populated as part of B5 (Ondrej self-test) and B6
(2-3 friends test).

Each example follows this naming pattern:

```
example-<NN>-<repo-shape>.md
```

Where `<repo-shape>` is a short descriptor of what the repo looked
like when diagnosed (e.g., `dense-claude-md`, `no-skills`,
`legacy-rails`, `personal-blog`).

PII rules apply to examples just like they apply to lab screenshots:
no real account names, no real client names, no real emails. Replace
with neutral placeholders (`acme-corp`, `team-alpha`, etc.) before
committing.

## Why we keep these

Two reasons:

1. **Calibration anchor.** Future rubric edits can be regression-tested
   against these example outputs. If a rubric change makes a previously
   good observation worse, the example output catches it.
2. **Transparency.** Anyone considering installing the skill can see
   what real output looks like before running it on their own repo.
