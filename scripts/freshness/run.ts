#!/usr/bin/env -S pnpm exec tsx
// cc-lab freshness skill v0 — raw delta watcher.
//
// Fetches a small set of Anthropic-surface URLs (CHANGELOG, README,
// docs sitemap), compares the result against the last committed
// snapshot in scripts/freshness/snapshot/, and writes an issue body
// summarizing the delta to scripts/freshness/output/<timestamp>.md.
//
// v0 produces *raw* delta — additions, removals, changed sections —
// without any lab-voice editorialization. v1 (after the design-system
// doc is wired in as a system prompt) will produce lab-shaped copy
// proposals. v1 is the lens-aware target measured by Phase 4 D9.
//
// Invocation:
//   pnpm tsx scripts/freshness/run.ts                 # write delta only
//   pnpm tsx scripts/freshness/run.ts --update-snapshot # also commit new snapshot
//   pnpm tsx scripts/freshness/run.ts --open-issue    # open a GitHub issue via gh
//
// Exit codes:
//   0 — completed (delta written; snapshot may or may not be updated)
//   1 — fetch error, parse error, or output write error

import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { spawnSync } from "node:child_process";

type Source = {
  id: string;
  label: string;
  url: string;
  kind: "markdown" | "xml-sitemap";
  filterPathPrefix?: string;
};

type Snapshot = {
  fetchedAt: string;
  sources: Record<string, SourceSnapshot>;
};

type SourceSnapshot = {
  url: string;
  label: string;
  kind: Source["kind"];
  hash: string;
  length: number;
  // For markdown sources: the top-level section headers, in order.
  // For sitemap sources: the list of URLs that match filterPathPrefix.
  index: string[];
  // Body is included for markdown sources only — used for diff
  // rendering. For sitemaps we only care about the URL list.
  body?: string;
};

// Always resolve relative to the script file, not the CWD, so the
// script works whether invoked from the repo root or from launchctl
// with a different starting directory.
const SCRIPT_DIR = __dirname;
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..", "..");
const FRESHNESS_DIR = SCRIPT_DIR;
const SOURCES_PATH = path.join(FRESHNESS_DIR, "sources.json");
const SNAPSHOT_PATH = path.join(FRESHNESS_DIR, "snapshot", "current.json");
const OUTPUT_DIR = path.join(FRESHNESS_DIR, "output");

async function main() {
  const updateSnapshot = process.argv.includes("--update-snapshot");
  const openIssue = process.argv.includes("--open-issue");

  const sources = await readSources();
  const previous = await readPreviousSnapshot();
  const current = await fetchAll(sources);

  const delta = computeDelta(previous, current);
  const body = renderIssueBody(current, delta);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const stamp = current.fetchedAt.replace(/[:.]/g, "-");
  const outPath = path.join(OUTPUT_DIR, `${stamp}.md`);
  await fs.writeFile(outPath, body, "utf-8");
  console.log(`wrote ${path.relative(REPO_ROOT, outPath)}`);

  if (updateSnapshot) {
    await fs.mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true });
    await fs.writeFile(SNAPSHOT_PATH, JSON.stringify(current, null, 2) + "\n", "utf-8");
    console.log(`updated ${path.relative(REPO_ROOT, SNAPSHOT_PATH)}`);
  }

  if (openIssue) {
    if (!delta.hasChanges) {
      console.log("no changes to surface; skipping issue creation");
      return;
    }
    const title = `Freshness ${current.fetchedAt.slice(0, 10)} — ${delta.summary}`;
    const result = spawnSync(
      "gh",
      ["issue", "create", "--title", title, "--body-file", outPath],
      { stdio: "inherit" },
    );
    if (result.status !== 0) {
      console.error("gh issue create failed");
      process.exit(1);
    }
  }
}

async function readSources(): Promise<Source[]> {
  const raw = await fs.readFile(SOURCES_PATH, "utf-8");
  const parsed = JSON.parse(raw) as { sources: Source[] };
  return parsed.sources;
}

async function readPreviousSnapshot(): Promise<Snapshot | null> {
  try {
    const raw = await fs.readFile(SNAPSHOT_PATH, "utf-8");
    return JSON.parse(raw) as Snapshot;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

async function fetchAll(sources: Source[]): Promise<Snapshot> {
  const fetchedAt = new Date().toISOString();
  const result: Snapshot = { fetchedAt, sources: {} };
  for (const source of sources) {
    result.sources[source.id] = await fetchOne(source);
  }
  return result;
}

async function fetchOne(source: Source): Promise<SourceSnapshot> {
  const res = await fetch(source.url, {
    headers: { "User-Agent": "cc-lab-freshness/0 (+https://cc-lab.ondrejsvec.com)" },
  });
  if (!res.ok) {
    throw new Error(`fetch failed for ${source.url}: HTTP ${res.status}`);
  }
  const body = await res.text();

  let index: string[];
  let storedBody: string | undefined;

  if (source.kind === "markdown") {
    index = extractMarkdownHeaders(body);
    storedBody = body;
  } else if (source.kind === "xml-sitemap") {
    index = extractSitemapUrls(body, source.filterPathPrefix);
  } else {
    throw new Error(`unknown kind: ${source.kind}`);
  }

  return {
    url: source.url,
    label: source.label,
    kind: source.kind,
    hash: sha256(body),
    length: body.length,
    index,
    body: storedBody,
  };
}

function extractMarkdownHeaders(body: string): string[] {
  return body
    .split("\n")
    .filter((line) => /^#{1,3}\s/.test(line))
    .map((line) => line.replace(/\s+$/, ""));
}

function extractSitemapUrls(xml: string, prefix?: string): string[] {
  const urls: string[] = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const url = m[1].trim();
    if (!prefix) {
      urls.push(url);
    } else {
      try {
        const parsed = new URL(url);
        if (parsed.pathname.startsWith(prefix)) urls.push(url);
      } catch {
        // skip malformed entries
      }
    }
  }
  urls.sort();
  return urls;
}

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

type Delta = {
  hasChanges: boolean;
  summary: string;
  perSource: SourceDelta[];
};

type SourceDelta = {
  source: SourceSnapshot;
  status: "new" | "changed" | "unchanged" | "removed";
  added: string[];
  removed: string[];
  bodyDiff?: string;
};

function computeDelta(previous: Snapshot | null, current: Snapshot): Delta {
  const perSource: SourceDelta[] = [];
  const previousIds = new Set(previous ? Object.keys(previous.sources) : []);
  const currentIds = new Set(Object.keys(current.sources));

  for (const id of currentIds) {
    const cur = current.sources[id];
    const prev = previous?.sources[id];
    if (!prev) {
      perSource.push({
        source: cur,
        status: "new",
        added: cur.index,
        removed: [],
      });
      continue;
    }
    if (prev.hash === cur.hash) {
      perSource.push({
        source: cur,
        status: "unchanged",
        added: [],
        removed: [],
      });
      continue;
    }
    const added = cur.index.filter((x) => !prev.index.includes(x));
    const removed = prev.index.filter((x) => !cur.index.includes(x));
    let bodyDiff: string | undefined;
    if (cur.kind === "markdown" && cur.body && prev.body) {
      bodyDiff = renderUnifiedDiff(prev.body, cur.body, 3);
    }
    perSource.push({
      source: cur,
      status: "changed",
      added,
      removed,
      bodyDiff,
    });
  }

  for (const id of previousIds) {
    if (currentIds.has(id)) continue;
    const prev = previous!.sources[id];
    perSource.push({
      source: prev,
      status: "removed",
      added: [],
      removed: prev.index,
    });
  }

  const changed = perSource.filter((d) => d.status === "changed").length;
  const newCount = perSource.filter((d) => d.status === "new").length;
  const removedCount = perSource.filter((d) => d.status === "removed").length;
  const summary = previous
    ? `${changed} changed · ${newCount} new · ${removedCount} removed`
    : "baseline snapshot";
  const hasChanges = previous !== null && (changed + newCount + removedCount) > 0;
  return { hasChanges, summary, perSource };
}

// Minimal unified-diff: emits a hunk per contiguous run of changes
// with `context` lines around it. Not as polished as `diff -U` but
// dependency-free and good enough for human review of a CHANGELOG.
function renderUnifiedDiff(a: string, b: string, context: number): string {
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  // Compute LCS-based diff lazily — for v0 we use a simple line-set
  // diff which over-reports moves but is cheap and correct for the
  // additive CHANGELOG case (rarely reordered).
  const aSet = new Set(aLines);
  const bSet = new Set(bLines);
  const out: string[] = [];
  // Walk b, emit + for new lines and " " for shared lines (with context).
  const buffer: string[] = [];
  for (let i = 0; i < bLines.length; i++) {
    const line = bLines[i];
    if (aSet.has(line)) {
      buffer.push(` ${line}`);
      if (buffer.length > context * 2) buffer.shift();
    } else {
      // Emit context buffer, then the addition.
      while (buffer.length > 0) {
        out.push(buffer.shift()!);
      }
      out.push(`+ ${line}`);
    }
  }
  // Removed lines (lines in a not in b) — emit at the end as a
  // separate hunk so they're visible.
  const removed: string[] = [];
  for (const line of aLines) {
    if (!bSet.has(line)) removed.push(`- ${line}`);
  }
  if (removed.length > 0) {
    out.push("\n--- removed lines ---");
    out.push(...removed);
  }
  return out.join("\n");
}

function renderIssueBody(snapshot: Snapshot, delta: Delta): string {
  const lines: string[] = [];
  lines.push(`# Freshness — ${snapshot.fetchedAt.slice(0, 10)}`);
  lines.push("");
  lines.push(`_Fetched at ${snapshot.fetchedAt}._`);
  lines.push("");
  // Three report shapes: baseline, no-change, and delta.
  const isBaseline = delta.summary === "baseline snapshot";
  if (isBaseline) {
    lines.push("**Baseline snapshot.** Future runs diff against this.");
    lines.push("");
    lines.push("## Captured surfaces");
    lines.push("");
    for (const id of Object.keys(snapshot.sources)) {
      const s = snapshot.sources[id];
      lines.push(`- **${s.label}** (${s.kind}) — ${s.length} bytes, ${s.index.length} index items`);
      lines.push(`  - ${s.url}`);
    }
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push("_v0 raw delta. Lens-aware copy proposals land in v1 once the design-system doc is wired in as system prompt._");
    return lines.join("\n");
  }
  if (!delta.hasChanges) {
    lines.push(delta.summary);
    lines.push("");
    lines.push("No changes since last snapshot. Lab is current.");
    return lines.join("\n");
  }
  lines.push(`**Summary:** ${delta.summary}`);
  lines.push("");
  lines.push("## What changed");
  lines.push("");
  for (const d of delta.perSource) {
    if (d.status === "unchanged") continue;
    lines.push(`### ${d.source.label} — ${d.status}`);
    lines.push("");
    lines.push(`Source: ${d.source.url}`);
    lines.push("");
    if (d.added.length > 0) {
      lines.push("**Added:**");
      lines.push("");
      for (const a of d.added) lines.push(`- ${a}`);
      lines.push("");
    }
    if (d.removed.length > 0) {
      lines.push("**Removed:**");
      lines.push("");
      for (const r of d.removed) lines.push(`- ${r}`);
      lines.push("");
    }
    if (d.bodyDiff) {
      lines.push("**Body diff:**");
      lines.push("");
      lines.push("```diff");
      lines.push(d.bodyDiff);
      lines.push("```");
      lines.push("");
    }
  }
  lines.push("---");
  lines.push("");
  lines.push("_v0 raw delta. Lens-aware copy proposals land in v1 once the design-system doc is wired in as system prompt._");
  return lines.join("\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
