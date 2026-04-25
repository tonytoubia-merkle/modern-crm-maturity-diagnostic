/**
 * Canonical brand tokens for the Merkle Maturity Assessment workspace.
 *
 * Three parallel systems applied in different contexts:
 *
 *   - M2     — tool shell (login, register, root chooser, /crm and /csc
 *              home pages, /admin, /about). Sourced from Figma file
 *              Gnio37paX1klQL0zrXefj3 (Merkle M2 Brand guide).
 *
 *   - MERKLE — artifact surfaces a user reaches once they begin an
 *              actual assessment / project / output. Includes
 *              /results/[shareId], /csc/results/[shareId], the print-PDF
 *              view, and the PPTX export. Sourced from Figma file
 *              uaMoNLzZ8FOk0EVnZN5ZVy (Merkle E-Commerce ARC), via its
 *              Core + Semantic variable collections.
 *
 *   - DENTSU — applied to /cannes today, and to a future /dentsu shell.
 *              Sourced from Figma files z6a62Ukdt4GdfR9FNbSL6a (DDS-Tokens)
 *              and IqsVsgc1xRJD5EGs2L361n (DDS-Components). Light theme.
 *
 * The /connections page intentionally does NOT use any of these — it
 * carries a Salesforce + Merkle blend defined inline.
 */

// ── M2 — Tool shell ────────────────────────────────────────────────
export const M2 = {
  // Primary brand
  navy: "#05051e",        // page background, dark surfaces, footer
  blue: "#0328d1",        // brand mark, primary buttons, accents
  blueAlt: "#1e1eb5",     // alternate brand blue (slightly lighter)

  // Secondary palette — accents, charts, callouts
  cyan: "#16c6d3",
  sky: "#2f98f7",
  purple: "#6311cb",

  // Neutrals
  text: "#1e1e1e",
  surfaceLight: "#edecf3",   // light tinted surface
  surfaceMid: "#c1cae0",     // cool gray accent (dividers, wireframe lines)
  white: "#ffffff",

  // Typography
  fontFamily: "Work Sans",
  fontWeights: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
} as const;

// ── MERKLE — Artifact / output surfaces ────────────────────────────
// Pulled directly from Core + Semantic variable collections in the
// Merkle E-Commerce ARC Figma. Names mirror the Figma token names.
export const MERKLE = {
  // Surface — dark navy that defines the artifact background
  surfaceNeutralDefault: "#051027",

  // Brand greys
  grey50: "#fcfcfc",
  grey60: "#f2f1f6",
  grey70: "#ececec",
  grey80: "#e1e1e1",
  grey100: "#cfcfcf",
  grey300: "#b2b2b2",
  grey500: "#a1a1a1",
  grey600: "#5c5c5c",
  grey700: "#454545",
  grey800: "#2e2e2e",
  grey900: "#171717",

  // Brand primary (coral / red family) — accent + emphasis
  primary100: "#ff958b",
  primary200: "#ff7c6d",
  primary300: "#c84b38",
  primary400: "#d5402b",
  primary500: "#8f1d0e",   // surface/primary/default
  primary600: "#9c2414",
  primary700: "#74180b",

  // Brand secondary (deep blue) — backgrounds, gradients, structure
  secondary100: "#8e9db9",
  secondary300: "#4f638c",
  secondary500: "#12295d",
  secondary600: "#040e4b",
  secondary700: "#0c1e48",
  secondary900: "#061431",

  // Brand "brand" green — Merkle mark color
  brandGreen500: "#154734",

  // Notification
  notificationBlue500: "#0058aa",
  notificationGreen500: "#03aa00",
  notificationRed500: "#db1616",

  // Neutrals
  white: "#ffffff",
  black: "#000000",

  // Typography — Proxima Nova family + responsive scale (large viewport)
  fontFamily: "Proxima Nova",
  type: {
    display: 72,
    h1: 64,
    h2: 48,
    h3: 40,
    h4: 32,
    h5: 20,
    h6: 16,
    bodyLg: 24,
    body: 20,
    bodySm: 16,
    caption: 12,
  },
  fontWeights: {
    regular: 400,
    semibold: 600,
    bold: 700,
  },
} as const;

// ── DENTSU — DDS Light theme ───────────────────────────────────────
// Pulled from Primitive: Color and Semantic: Color (Light | Connect 3.0)
// in the DDS-Tokens Figma file.
export const DENTSU = {
  // Backgrounds + surfaces
  bgBase: "#f7f7f8",            // Neutral/50 — page background (slightly off-white)
  bgInverse: "#040406",         // Neutral/1350 — inverse surface (near-black)
  surface1: "#ffffff",          // Neutral/0
  surface2: "#fafafb",          // Neutral/25
  surface3: "#f7f7f8",          // Neutral/50
  surfaceGlobalHeader: "#040406", // Neutral/1350
  surfaceSideMenu: "#434357",     // Neutral/800

  // Primary brand accent (signature DDS dark mono)
  fillAccent1: "#0d0d11",       // Neutral/1250
  fillAccent1Hover: "#2c2c3a",  // Neutral/1000
  fillAccent1Pressed: "#373748", // Neutral/900

  // Secondary brand accent (DDS Blue)
  fillAccent2: "#076cdf",       // Blue/500
  blue50: "#e6f0fb",
  blue100: "#cde1f8",
  blue300: "#6aa6eb",
  blue500: "#076cdf",
  blue600: "#0556b2",
  blue700: "#044085",

  // Text
  textDefault: "#0d0d11",       // Neutral/1250
  textSupportive: "#60607b",    // Neutral/700
  textOnDark: "#ffffff",
  textError: "#b0251c",         // Red/600
  textSuccess: "#257f4e",       // Green/700

  // Borders
  borderDefault: "#ceced6",     // Neutral/300
  borderHover: "#bebec9",       // Neutral/400
  borderFocus: "#0d0d11",
  borderGlobalNav: "#262631",   // Neutral/1050

  // Status palette
  errorRed500: "#dc2f23",
  errorRed600: "#b0251c",
  successGreen500: "#3ed483",
  successGreen700: "#257f4e",
  warningAmber500: "#ff9b3f",

  // AI accent (Purple) — DDS has dedicated AI tokens
  aiAccent: "#5b19c4",          // Purple/500
  aiAccentHover: "#5116b0",     // Purple/550
  aiAccentPressed: "#48149c",   // Purple/600

  // Chart category palette (12-color sequence)
  chart: [
    "#6aa6eb", // Blue/300
    "#8c5ed5", // Purple/350
    "#00a1a5", // Turquoise/600
    "#a32dc1", // Magenta/500
    "#044085", // Blue/700
    "#daabe6", // Magenta/200
    "#5b19c4", // Purple/500
    "#ffeb72", // Yellow/500
    "#0660c8", // Blue/550
    "#611b73", // Magenta/700
    "#99e9eb", // Turquoise/200
    "#005052", // Turquoise/800
  ] as const,

  // Typography
  fontFamily: "Inter",
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  // Type ramp (px) — straight from DDS Primitive: Typography
  type: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 28,
    "4xl": 32,
    "5xl": 38,
    "6xl": 48,
    "7xl": 54,
    "8xl": 58,
  },
} as const;

export type BrandKey = "m2" | "merkle" | "dentsu";
