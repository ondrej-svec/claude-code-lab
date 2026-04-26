"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  /**
   * Optional dark-mode variant. Light mode shows `src`, dark mode shows `darkSrc`.
   */
  darkSrc?: string;
  /**
   * Underlying text for the copy button. If omitted, no copy button renders.
   * Pass the same text the freeze SVG was generated from so readers can copy
   * the command or output verbatim.
   */
  text?: string;
  width?: number;
  height?: number;
};

/**
 * TerminalOutput — static terminal still produced by `freeze`.
 *
 * Place SVGs/PNGs under `public/visuals/` and reference with leading slash:
 *
 *     <TerminalOutput
 *       src="/visuals/diagnose-output-example.svg"
 *       alt="Diagnostic output on a real repo"
 *       caption="Example diagnostic output."
 *       text={`$ claude /cc-lab-diagnose\n...`}
 *     />
 *
 * For the copy affordance, pass the underlying text via `text`. The component
 * does not parse the SVG; the source-of-truth for copy is the prop.
 */
export function TerminalOutput({
  src,
  alt,
  caption,
  darkSrc,
  text,
  width = 1600,
  height = 900,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
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
    <figure className="my-6">
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        {darkSrc ? (
          <>
            <div className="block dark:hidden">
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="w-full h-auto block"
              />
            </div>
            <div className="hidden dark:block">
              <Image
                src={darkSrc}
                alt={alt}
                width={width}
                height={height}
                className="w-full h-auto block"
              />
            </div>
          </>
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto block"
          />
        )}
        {text && (
          <button
            type="button"
            onClick={handleCopy}
            aria-label={
              copied
                ? "Terminal output copied to clipboard"
                : "Copy terminal output to clipboard"
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
        )}
      </div>
      {caption && (
        <figcaption
          className="text-xs mt-2"
          style={{ color: "var(--text-muted)" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
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
