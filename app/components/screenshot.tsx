import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  /**
   * Optional dark-mode variant. If provided, light-mode shows `src`
   * and dark-mode shows `darkSrc`. If omitted, `src` is used for both.
   */
  darkSrc?: string;
  width?: number;
  height?: number;
};

/**
 * Screenshot — bordered, captioned image for chapter content.
 *
 * Place PNGs under `public/screenshots/` and reference with leading slash:
 *
 *     <Screenshot
 *       src="/screenshots/install-welcome.png"
 *       alt="Claude Code desktop app on first launch"
 *       caption="The desktop app after `claude.ai` sign-in."
 *     />
 *
 * For separate light/dark captures, also pass `darkSrc`.
 */
export function Screenshot({
  src,
  alt,
  caption,
  darkSrc,
  width = 1600,
  height = 1000,
}: Props) {
  return (
    <figure className="my-6">
      <div
        className="rounded-xl overflow-hidden"
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
