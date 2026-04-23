import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import Link from "next/link";
import { Diagram } from "./diagram";

function H1({ children }: { children?: ReactNode }) {
  return (
    <h1
      className="text-4xl md:text-5xl font-semibold leading-[1.1] mb-6 mt-0"
      style={{ color: "var(--text-primary)" }}
    >
      {children}
    </h1>
  );
}

function H2({ children, id }: { children?: ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="text-2xl md:text-3xl font-semibold leading-tight mt-14 mb-4"
      style={{ color: "var(--text-primary)" }}
    >
      {children}
    </h2>
  );
}

function H3({ children, id }: { children?: ReactNode; id?: string }) {
  return (
    <h3
      id={id}
      className="text-xl font-semibold leading-snug mt-8 mb-3"
      style={{ color: "var(--text-primary)" }}
    >
      {children}
    </h3>
  );
}

function P({ children }: { children?: ReactNode }) {
  return (
    <p
      className="my-4 leading-relaxed"
      style={{ color: "var(--text-primary)" }}
    >
      {children}
    </p>
  );
}

function UL({ children }: { children?: ReactNode }) {
  return (
    <ul
      className="my-4 ml-6 list-disc space-y-1.5"
      style={{ color: "var(--text-primary)" }}
    >
      {children}
    </ul>
  );
}

function OL({ children }: { children?: ReactNode }) {
  return (
    <ol
      className="my-4 ml-6 list-decimal space-y-1.5"
      style={{ color: "var(--text-primary)" }}
    >
      {children}
    </ol>
  );
}

function LI({ children }: { children?: ReactNode }) {
  return <li className="leading-relaxed">{children}</li>;
}

function Anchor({
  href,
  children,
}: {
  href?: string;
  children?: ReactNode;
}) {
  const isInternal = href?.startsWith("/");
  const isAnchor = href?.startsWith("#");
  const className = "motion-link underline underline-offset-4";
  const style = { color: "var(--accent-surface)" };

  if (isInternal) {
    return (
      <Link href={href!} className={className} style={style}>
        {children}
      </Link>
    );
  }
  if (isAnchor) {
    return (
      <a href={href} className={className} style={style}>
        {children}
      </a>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      {children} ↗
    </a>
  );
}

function InlineCode({ children }: { children?: ReactNode }) {
  return (
    <code
      className="px-1.5 py-0.5 rounded text-[0.9em]"
      style={{
        background: "var(--code-bg)",
        border: "1px solid var(--code-border)",
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      }}
    >
      {children}
    </code>
  );
}

function Pre({ children }: { children?: ReactNode }) {
  return (
    <pre
      className="my-5 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed"
      style={{
        background: "var(--code-bg)",
        border: "1px solid var(--code-border)",
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      }}
    >
      {children}
    </pre>
  );
}

function Blockquote({ children }: { children?: ReactNode }) {
  return (
    <blockquote
      className="my-5 pl-4 border-l-2 italic"
      style={{
        borderColor: "var(--accent-surface)",
        color: "var(--text-secondary)",
      }}
    >
      {children}
    </blockquote>
  );
}

function HR() {
  return (
    <hr
      className="my-10 border-0 h-px"
      style={{ background: "var(--border)" }}
    />
  );
}

function Table({ children }: { children?: ReactNode }) {
  return (
    <div className="my-5 overflow-x-auto">
      <table
        className="w-full text-sm border-collapse"
        style={{
          background: "var(--surface-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
        }}
      >
        {children}
      </table>
    </div>
  );
}

function THead({ children }: { children?: ReactNode }) {
  return (
    <thead
      style={{ background: "var(--surface-panel)" }}
      className="text-left"
    >
      {children}
    </thead>
  );
}

function TH({ children }: { children?: ReactNode }) {
  return (
    <th
      className="px-3 py-2 font-semibold text-xs uppercase tracking-wide"
      style={{
        color: "var(--text-secondary)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {children}
    </th>
  );
}

function TD({ children }: { children?: ReactNode }) {
  return (
    <td
      className="px-3 py-2 align-top"
      style={{
        color: "var(--text-primary)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {children}
    </td>
  );
}

function TR({ children }: { children?: ReactNode }) {
  return <tr>{children}</tr>;
}

function Strong({ children }: { children?: ReactNode }) {
  return (
    <strong className="font-semibold" style={{ color: "var(--text-primary)" }}>
      {children}
    </strong>
  );
}

export function Callout({
  variant = "note",
  children,
}: {
  variant?: "note" | "warn" | "tip";
  children?: ReactNode;
}) {
  const border =
    variant === "warn"
      ? "var(--danger)"
      : variant === "tip"
        ? "var(--accent-surface)"
        : "var(--text-secondary)";
  return (
    <aside
      className="my-6 p-4 rounded-lg border-l-[3px]"
      style={{
        borderLeftColor: border,
        background: "var(--surface-elevated)",
        color: "var(--text-primary)",
      }}
    >
      {children}
    </aside>
  );
}

export const mdxComponents: MDXComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  ul: UL,
  ol: OL,
  li: LI,
  a: Anchor,
  code: InlineCode,
  pre: Pre,
  blockquote: Blockquote,
  hr: HR,
  strong: Strong,
  table: Table,
  thead: THead,
  tbody: ({ children }: { children?: ReactNode }) => <tbody>{children}</tbody>,
  tr: TR,
  th: TH,
  td: TD,
  Callout,
  Diagram,
};
