"use client";

import Link, { useLinkStatus } from "next/link";

type Props = {
  href: string;
  label: string;
};

export function LandingCta({ href, label }: Props) {
  return (
    <Link
      href={href}
      className="motion-button inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium min-w-[10rem]"
      style={{
        background: "var(--accent-surface)",
        color: "var(--accent-text)",
      }}
    >
      <CtaLabel label={label} />
    </Link>
  );
}

function CtaLabel({ label }: { label: string }) {
  const { pending } = useLinkStatus();
  return (
    <>
      {pending ? <Spinner /> : null}
      <span>{label}</span>
    </>
  );
}

function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        opacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
