/**
 * Merkle logo lockup.
 *
 * Component name kept as `M2Logo` for back-compat with the dozen-plus
 * call sites that already reference it; the rendered mark is the
 * Merkle logo (`/merkle-logo.webp`).
 *
 * Tone behaviour:
 *   tone="light"  → natural Merkle logo (dark on light surfaces)
 *   tone="dark"   → inverted to white via brightness-0 + invert filter
 *                   (Merkle logo on dark M2 navy header)
 */

type Tone = "dark" | "light";

interface M2LogoProps {
  tone?: Tone;
  className?: string;
  /** Pixel height of the lockup. Width is derived from aspect ratio. */
  height?: number;
}

export function M2Logo({ tone = "dark", className, height = 32 }: M2LogoProps) {
  const inverted = tone === "dark" ? "brightness-0 invert" : "";
  const composed = [inverted, className].filter(Boolean).join(" ");

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/merkle-logo.webp"
      alt="Merkle"
      style={{ height, width: "auto" }}
      className={composed || undefined}
    />
  );
}
