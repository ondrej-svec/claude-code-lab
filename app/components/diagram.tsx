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

        // Rose Pine palette — Moon (dark) / Dawn (light).
        // https://rosepinetheme.com/palette/
        const darkVars = {
          background: "transparent",
          mainBkg: "#2a283e",
          primaryColor: "#2a283e",
          primaryTextColor: "#e0def4",
          primaryBorderColor: "#44415a",
          secondaryColor: "#393552",
          secondaryTextColor: "#e0def4",
          secondaryBorderColor: "#44415a",
          tertiaryColor: "#232136",
          tertiaryTextColor: "#908caa",
          tertiaryBorderColor: "#44415a",
          lineColor: "#908caa",
          textColor: "#e0def4",
          nodeTextColor: "#e0def4",
          edgeLabelBackground: "#2a273f",
          clusterBkg: "rgba(57, 53, 82, 0.35)",
          clusterBorder: "#44415a",
          titleColor: "#e0def4",
          defaultLinkColor: "#908caa",
          fontFamily: '"Manrope", "Inter", system-ui, sans-serif',
        };

        const lightVars = {
          background: "transparent",
          mainBkg: "#fffaf3",
          primaryColor: "#fffaf3",
          primaryTextColor: "#575279",
          primaryBorderColor: "#d7cec5",
          secondaryColor: "#f2e9e1",
          secondaryTextColor: "#575279",
          secondaryBorderColor: "#d7cec5",
          tertiaryColor: "#faf4ed",
          tertiaryTextColor: "#797593",
          tertiaryBorderColor: "#d7cec5",
          lineColor: "#797593",
          textColor: "#575279",
          nodeTextColor: "#575279",
          edgeLabelBackground: "#f2e9e1",
          clusterBkg: "rgba(242, 233, 225, 0.55)",
          clusterBorder: "#d7cec5",
          titleColor: "#575279",
          defaultLinkColor: "#797593",
          fontFamily: '"Manrope", "Inter", system-ui, sans-serif',
        };

        // Small polish layer on top of mermaid's base theme: rounded
        // corners on rectangles, medium-weight labels, uniform stroke.
        const themeCSS = `
          .node rect, .node polygon {
            stroke-width: 1.25px;
            rx: 6; ry: 6;
          }
          .node .label foreignObject,
          .node .label div,
          .edgeLabel foreignObject,
          .edgeLabel div {
            font-family: "Manrope", "Inter", system-ui, sans-serif !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            letter-spacing: 0.01em;
          }
          .flowchart-link, .path {
            stroke-width: 1.25px;
          }
          .cluster rect { rx: 10; ry: 10; stroke-width: 1px; }
        `;

        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          securityLevel: "loose",
          fontFamily: '"Manrope", "Inter", system-ui, sans-serif',
          flowchart: {
            curve: "basis",
            nodeSpacing: 48,
            rankSpacing: 56,
            padding: 12,
            htmlLabels: true,
            useMaxWidth: true,
          },
          themeVariables: isDark ? darkVars : lightVars,
          themeCSS,
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

  const wrapperClass =
    "flex justify-center p-6 rounded-xl overflow-x-auto";
  const wrapperStyle = {
    background: "var(--surface-elevated)",
    border: "1px solid var(--border)",
  };

  return (
    <figure className="my-6">
      {svg ? (
        <div
          ref={ref}
          className={wrapperClass}
          style={wrapperStyle}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div ref={ref} className={wrapperClass} style={wrapperStyle}>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Rendering…
          </span>
        </div>
      )}
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
