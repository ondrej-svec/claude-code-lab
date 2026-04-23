"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";

function flattenChildren(children: ReactNode): string {
  if (children == null) return "";
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) {
    return children.map((c) => flattenChildren(c)).join("");
  }
  // React element (e.g. <p>wrapped</p>) — flatten its children.
  // We use the runtime check rather than imports to stay cheap.
  if (typeof children === "object" && "props" in children) {
    return flattenChildren(
      (children as { props?: { children?: ReactNode } }).props?.children,
    );
  }
  return "";
}

type Props = {
  chart?: string;
  b64?: string;
  caption?: string;
  children?: React.ReactNode;
};

// Mermaid renders on the client. We import it lazily so it's only loaded
// when a chapter actually has a diagram.
//
// The chart source arrives via the `b64` prop — remark-mermaid transforms
// fenced ```mermaid blocks into <Diagram b64="…" /> JSX. We use base64
// because next-mdx-remote 6.x drops multi-line JSX expression attributes
// and expression children, but single-word plain-string attributes survive.
// `chart` (plain string) and children stay as fallbacks for direct JSX use.
export function Diagram({ chart, b64, caption, children }: Props) {
  const decoded = b64
    ? typeof Buffer !== "undefined"
      ? Buffer.from(b64, "base64").toString("utf8")
      : decodeURIComponent(escape(atob(b64)))
    : "";
  const source =
    (decoded && decoded.trim()) ||
    (chart && chart.trim()) ||
    flattenChildren(children).trim();

  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;

        const isDark = resolvedTheme === "dark";

        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          securityLevel: "loose",
          fontFamily: "Inter, system-ui, sans-serif",
          themeVariables: isDark
            ? {
                background: "transparent",
                primaryColor: "#2a273f",
                primaryTextColor: "#e0def4",
                primaryBorderColor: "#6e6a86",
                lineColor: "#908caa",
                textColor: "#e0def4",
              }
            : {
                background: "transparent",
                primaryColor: "#fffaf3",
                primaryTextColor: "#575279",
                primaryBorderColor: "#9893a5",
                lineColor: "#797593",
                textColor: "#575279",
              },
        });

        if (!source) {
          throw new Error("Diagram: no chart content provided");
        }
        const id = `d-${Math.random().toString(36).slice(2, 9)}`;
        const { svg: rendered } = await mermaid.render(id, source);
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : String(err);
        if (!cancelled) setError(message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source, resolvedTheme]);

  if (error) {
    return (
      <div
        className="my-5 p-4 rounded-lg text-sm"
        style={{
          background: "var(--danger-surface)",
          border: "1px solid var(--danger-border)",
          color: "var(--danger)",
        }}
      >
        Diagram failed: {error}
      </div>
    );
  }

  return (
    <figure className="my-6">
      <div
        ref={ref}
        className="flex justify-center p-6 rounded-xl overflow-x-auto"
        style={{
          background: "var(--surface-elevated)",
          border: "1px solid var(--border)",
        }}
        dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
      >
        {!svg && (
          <span
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Rendering…
          </span>
        )}
      </div>
      {caption && (
        <figcaption
          className="text-xs text-center mt-2"
          style={{ color: "var(--text-muted)" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
