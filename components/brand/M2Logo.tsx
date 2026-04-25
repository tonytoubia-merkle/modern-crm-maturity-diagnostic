/**
 * M2 logo lockup — Merkle's internal-tool brand mark.
 *
 * Sourced visually from the M2 Brand guide
 * (Figma file Gnio37paX1klQL0zrXefj3).
 *
 * Composition:
 *   MERKLE   ← small-caps wordmark, sits above
 *   ▶ M²    ← bold sans-serif mark with a sky chevron at the
 *             bottom-left, and a smaller superscript "2".
 *
 * The chevron color shifts depending on background:
 *   - on dark surfaces: M2 sky (#2f98f7)
 *   - on light surfaces: M2 blue (#0328d1)
 *
 * Usage:
 *   <M2Logo tone="dark" />     // for navy/dark headers — fills are white
 *   <M2Logo tone="light" />    // for light surfaces — fills are M2 navy
 */

type Tone = "dark" | "light";

interface M2LogoProps {
  tone?: Tone;
  className?: string;
  /** pixel height of the lockup; width is derived from aspect ratio */
  height?: number;
}

export function M2Logo({ tone = "dark", className, height = 32 }: M2LogoProps) {
  const ink = tone === "dark" ? "#ffffff" : "#05051e";
  const accent = tone === "dark" ? "#2f98f7" : "#0328d1";

  // viewBox: 110 × 56 — wordmark on top row, mark+chevron on bottom row
  return (
    <svg
      role="img"
      aria-label="Merkle M2"
      viewBox="0 0 110 56"
      height={height}
      width={(height * 110) / 56}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* "MERKLE" — small wordmark across the top */}
      <text
        x="0"
        y="13"
        fill={ink}
        fontFamily='"Work Sans", Inter, system-ui, sans-serif'
        fontWeight={500}
        fontSize="11"
        letterSpacing="1.8"
      >
        MERKLE
      </text>

      {/* Sky chevron — small right-pointing triangle at bottom-left */}
      <polygon
        points="0,54 0,32 11,43"
        fill={accent}
      />

      {/* "M²" mark — bold sans-serif, large */}
      <text
        x="14"
        y="52"
        fill={ink}
        fontFamily='"Work Sans", Inter, system-ui, sans-serif'
        fontWeight={900}
        fontSize="38"
        letterSpacing="-1"
      >
        M
        <tspan
          fontSize="22"
          dy="-14"
          dx="-2"
        >
          2
        </tspan>
      </text>
    </svg>
  );
}
