"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export function Prompt({ children }: Props) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  // Unwrap any auto-linked URLs that remark-gfm turned into anchors with a
  // trailing " ↗". Prompts are meant to be copied, not clicked.
  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    pre.querySelectorAll("a").forEach((a) => {
      const text = (a.textContent ?? "").replace(/\s*↗\s*$/u, "").trim();
      a.replaceWith(document.createTextNode(text));
    });
  }, [children]);

  async function handleCopy() {
    const pre = preRef.current;
    if (!pre) return;
    const clone = pre.cloneNode(true) as HTMLPreElement;
    clone.querySelectorAll("a").forEach((a) => {
      const text = (a.textContent ?? "").replace(/\s*↗\s*$/u, "").trim();
      a.replaceWith(document.createTextNode(text));
    });
    const text = clone.textContent?.trim() ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — button stays idle
    }
  }

  return (
    <div className="relative my-5">
      <pre
        ref={preRef}
        className="p-4 pr-12 rounded-lg overflow-x-auto text-sm leading-relaxed whitespace-pre-wrap [&_a]:no-underline [&_a]:text-inherit"
        style={{
          background: "var(--code-bg)",
          border: "1px solid var(--code-border)",
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          color: "var(--text-primary)",
        }}
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={
          copied ? "Prompt copied to clipboard" : "Copy prompt to clipboard"
        }
        className="absolute top-2 right-2 p-1.5 rounded-md transition-colors"
        style={{
          background: "var(--surface-elevated)",
          border: "1px solid var(--code-border)",
          color: copied
            ? "var(--accent-surface)"
            : "var(--text-secondary)",
        }}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
