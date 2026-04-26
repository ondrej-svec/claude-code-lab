"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  /**
   * First-frame poster image. Required — both as a fallback for users with
   * `prefers-reduced-motion: reduce` and as the visual placeholder while the
   * video loads.
   */
  poster: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

/**
 * TerminalCast — animated terminal recording produced by `vhs`.
 *
 * Place WebM under `public/visuals/` and reference with leading slash:
 *
 *     <TerminalCast
 *       src="/visuals/diagnose-running.webm"
 *       poster="/visuals/diagnose-running.poster.png"
 *       alt="Diagnostic skill running on a real repo"
 *       caption="A 30-second pass."
 *     />
 *
 * Behavior:
 * - Autoplay, loop, muted, no controls — these are silent visual loops.
 * - `prefers-reduced-motion: reduce` collapses to a still poster image with
 *   the same border/caption treatment.
 */
export function TerminalCast({
  src,
  poster,
  alt,
  caption,
  width = 1600,
  height = 900,
}: Props) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <figure className="my-6">
      <div
        className="rounded-xl overflow-hidden"
        style={{
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        {reduceMotion ? (
          <Image
            src={poster}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto block"
          />
        ) : (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            width={width}
            height={height}
            autoPlay
            loop
            muted
            playsInline
            aria-label={alt}
            className="w-full h-auto block"
          />
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
