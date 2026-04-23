"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

type Props = {
  chart: string;
  caption?: string;
};

// Mermaid renders on the client. We import it lazily so it's only loaded
// when a chapter actually has a diagram.
export function Diagram({ chart, caption }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const mermaid = (await import("mermaid")).default;

      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        fontFamily: "var(--font-body), Inter, system-ui, sans-serif",
        themeVariables:
          resolvedTheme === "dark"
            ? {
                background: "transparent",
                primaryColor: "#393552",
                primaryTextColor: "#e0def4",
                primaryBorderColor: "#6e6a86",
                lineColor: "#908caa",
                secondaryColor: "#2a273f",
                tertiaryColor: "#232136",
                noteBkgColor: "#2a273f",
                noteTextColor: "#e0def4",
                textColor: "#e0def4",
              }
            : {
                background: "transparent",
                primaryColor: "#faf4ed",
                primaryTextColor: "#575279",
                primaryBorderColor: "#9893a5",
                lineColor: "#797593",
                secondaryColor: "#f2e9e1",
                tertiaryColor: "#f4ede8",
                noteBkgColor: "#f4ede8",
                noteTextColor: "#575279",
                textColor: "#575279",
              },
      });

      try {
        const id = `d-${Math.random().toString(36).slice(2, 9)}`;
        const { svg: rendered } = await mermaid.render(id, chart);
        if (!cancelled) setSvg(rendered);
      } catch (err) {
        if (!cancelled) setError(String(err));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, resolvedTheme]);

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
