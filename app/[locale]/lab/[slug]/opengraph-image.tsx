import { ImageResponse } from "next/og";
import { getChapter } from "@/lib/chapters";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export const alt = "claude-code-lab chapter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ChapterOpengraphImage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  const chapter = getChapter(params.slug);

  const eyebrow = chapter?.eyebrows[locale] ?? "claude-code-lab";
  const title = chapter?.titles[locale] ?? "claude-code-lab";

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
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
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
            bottom: -60,
            left: -60,
            width: 420,
            height: 420,
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
            gap: 28,
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#c4a7e7",
              display: "flex",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 600,
              lineHeight: 1.05,
              color: "#f6f3ff",
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            {title}
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
          <span>claude-code-lab-nine.vercel.app/{locale}/lab/{params.slug}</span>
          <span>{locale.toUpperCase()}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
