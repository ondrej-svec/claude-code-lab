import { useEffect, useRef, useState } from "react";
import type { Locale } from "../types";

const LINES: Record<Locale, string[]> = {
  en: [
    "> initializing sub-etha relay…",
    "> infinite improbability drive: stable",
    "> the guide is now open",
  ],
  cs: [
    "> ladím sub-etha vysílač…",
    "> nekonečně nepravděpodobnostní pohon: stabilní",
    "> průvodce otevřen",
  ],
};

type Phase = "scan" | "typing" | "panic" | "done";

const TIMINGS = {
  scan: 700,
  perLine: 550,
  panicHold: 900,
  fadeOut: 380,
};

const REDUCED_TIMINGS = {
  scan: 0,
  perLine: 0,
  panicHold: 220,
  fadeOut: 180,
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Boot({ locale, onDone }: { locale: Locale; onDone: () => void }) {
  const reduced = useRef(prefersReducedMotion()).current;
  const t = reduced ? REDUCED_TIMINGS : TIMINGS;
  const lines = LINES[locale];
  const [phase, setPhase] = useState<Phase>("scan");
  const [shownLines, setShownLines] = useState(0);
  const [exiting, setExiting] = useState(false);
  const dismissed = useRef(false);

  function finish() {
    if (dismissed.current) return;
    dismissed.current = true;
    setExiting(true);
    window.setTimeout(onDone, t.fadeOut);
  }

  // Phase scheduling.
  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        setPhase("typing");
        for (let i = 0; i < lines.length; i++) {
          timers.push(
            window.setTimeout(
              () => {
                if (cancelled) return;
                setShownLines(i + 1);
              },
              t.perLine * (i + 1),
            ),
          );
        }
        timers.push(
          window.setTimeout(
            () => {
              if (cancelled) return;
              setPhase("panic");
            },
            t.perLine * (lines.length + 1),
          ),
        );
        timers.push(
          window.setTimeout(
            () => {
              if (cancelled) return;
              finish();
            },
            t.perLine * (lines.length + 1) + t.panicHold,
          ),
        );
      }, t.scan),
    );

    return () => {
      cancelled = true;
      for (const id of timers) window.clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Skip on any keypress / click.
  useEffect(() => {
    function handle() {
      finish();
    }
    window.addEventListener("keydown", handle, { once: true });
    window.addEventListener("pointerdown", handle, { once: true });
    return () => {
      window.removeEventListener("keydown", handle);
      window.removeEventListener("pointerdown", handle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`boot ${exiting ? "boot--exit" : ""} ${reduced ? "boot--reduced" : ""}`}
      role="presentation"
      aria-hidden
    >
      <div className="boot__scrim" />
      {!reduced && <div className="boot__scan" />}
      <div className="boot__crt">
        <div className="boot__inner">
          <div className="boot__lines" data-phase={phase}>
            {phase !== "scan" &&
              lines.slice(0, shownLines).map((line, i) => (
                <div key={i} className="boot__line">
                  {line}
                </div>
              ))}
          </div>
          {phase === "panic" && (
            <div className="boot__panic">
              <span>DON'T</span>
              <span>PANIC</span>
            </div>
          )}
        </div>
      </div>
      <div className="boot__hint">
        {locale === "cs" ? "klikni pro přeskočení" : "click to skip"}
      </div>
    </div>
  );
}
