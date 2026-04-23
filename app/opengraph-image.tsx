import { ImageResponse } from "next/og";

export const alt = "claude-code-lab — A practice for developers working with agents.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#191724",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#e0def4",
          position: "relative",
        }}
      >
        {/* Ambient accent lines (Rosé Pine Moon palette) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 420,
            height: 420,
            background:
              "radial-gradient(circle, rgba(196,167,231,0.14) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 360,
            height: 360,
            background:
              "radial-gradient(circle, rgba(156,207,216,0.10) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#908caa",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: "#c4a7e7",
              display: "flex",
            }}
          />
          claude-code-lab
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 960,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              lineHeight: 1.05,
              color: "#f6f3ff",
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            A practice for developers working with agents.
          </div>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.4,
              color: "#b4b0d0",
              display: "flex",
            }}
          >
            Install. Give it context. Iterate with discipline. Build the patterns that compound.
          </div>
        </div>

        <div
          style={{
            fontSize: 20,
            color: "#6e6a86",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>claude-code-lab-nine.vercel.app</span>
          <span>Rosé Pine · EN / CS</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
