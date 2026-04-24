# Contributing

The lab is open source. If something's wrong, unclear, or could be better, open an issue or a PR.

## Good things to contribute

- **Czech voice corrections.** The Czech version is written in peer voice, not localised-translation style. If something reads stilted or czenglish, flag it or propose a fix.
- **Small teaching improvements.** Clearer phrasing, a tighter example, a diagram that explains a concept better than the prose.
- **Content accuracy.** Claude Code changes fast. If something in the guide drifted from reality, file an issue or fix it.
- **Sample project fixes.** The samples are meant to be minimal and correct — if you find a bug in the `.NET` or `Python + React` sample, a PR is welcome.

## Before opening a PR

```bash
pnpm lint
pnpm test
pnpm build
```

Green locally is the bar. The Vercel preview deploy will give you a shareable URL to eyeball the change before merge.

## Voice

For both EN and CS: short sentences, practical framing, no corporate polish. Peer-to-peer, not a vendor explaining their product. If you're not sure whether a phrasing fits, open a draft PR and I'll say.

## Scope I probably won't accept

- Framework swaps (it's Next.js; it stays Next.js).
- New chapters without a clear teaching reason.
- Generic motivational copy or sales-style language.

## License

By opening a PR you agree that your contribution is licensed under the same MIT terms as the rest of the repo.
