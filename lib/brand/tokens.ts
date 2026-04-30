/**
 * Canonical brand tokens for the Merkle Maturity Assessment workspace.
 *
 * Three parallel systems applied in different contexts:
 *
 *   - M2     – tool shell (login, register, root chooser, /crm and /csc
 *              home pages, /admin, /about). Sourced from Figma file
 *              Gnio37paX1klQL0zrXefj3 (Merkle M2 Brand guide). The M2
 *              file has no variable collections; values below are read
 *              directly off the brand-guide art and the primary mark
 *              SVG (which lives at public/m2-logo.svg).
 *
 *   - MERKLE – artifact surfaces a user reaches once they begin an
 *              actual assessment / project / output. Includes
 *              /results/[shareId], /csc/results/[shareId], the print-PDF
 *              view, and the PPTX export. Sourced from Figma file
 *              uaMoNLzZ8FOk0EVnZN5ZVy (Merkle E-Commerce ARC), via its
 *              Core (color/Brand/* + color/WL/*) and Semantic
 *              (color/surface/*) variable collections.
 *
 *   - DENTSU – applied to /cannes today, and to a future /dentsu shell.
 *              Sourced from Figma files z6a62Ukdt4GdfR9FNbSL6a
 *              (DDS-Tokens) and IqsVsgc1xRJD5EGs2L361n (DDS-Components).
 *              Light theme. Includes Primitive: Color, Border radius,
 *              and a curated subset of Primitive: Spacing.
 *
 * The /connections page intentionally does NOT use any of these – it
 * carries a Salesforce + Merkle blend defined inline.
 *
 * Scales below are reproduced verbatim from Figma – when the brand
 * teams change a variable, regenerate this file rather than tweaking
 * values by hand.
 */

// ── M2 – Tool shell ────────────────────────────────────────────────
// No variable collection in the M2 file; these are the documented
// brand-guide values. The primary mark SVG is pulled into
// components/brand/M2Logo.tsx and public/m2-logo.svg from node 2003:226.
export const M2 = {
  // Primary brand
  navy: "#05051e",        // page background, dark surfaces, footer
  blue: "#0328d1",        // brand mark, primary buttons, accents
  blueAlt: "#1e1eb5",     // alternate brand blue (slightly lighter)

  // Secondary palette – accents, charts, callouts
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

// ── MERKLE – Artifact / output surfaces ────────────────────────────
// Pulled directly from Core (color/Brand/* + color/WL/*) and Semantic
// (color/surface/*) collections in the Merkle E-Commerce ARC Figma.
// The "WL" prefix in source = "white-label" – these are the paintable
// brand scales. Greys are duplicated under both Brand/ and WL/ in the
// source; we keep one canonical scale here.
export const MERKLE = {
  // Core surface – the dark navy that defines artifact backgrounds
  // (color/surface/neutral/default → #051027, set as a raw hex in
  // the Semantic collection rather than via an alias)
  surfaceNeutralDefault: "#051027",

  // Brand greys – full 50–900 scale
  grey50: "#fcfcfc",
  grey60: "#f2f1f6",
  grey70: "#ececec",
  grey80: "#e1e1e1",
  grey90: "#d9d9d9",
  grey100: "#cfcfcf",
  grey200: "#c2c2c2",
  grey300: "#b2b2b2",
  grey400: "#acacac",
  grey500: "#a1a1a1",
  grey600: "#5c5c5c",
  grey700: "#454545",
  grey800: "#2e2e2e",
  grey900: "#171717",

  // Brand primary (coral / red) – accent + emphasis
  primary100: "#ff958b",
  primary200: "#ff7c6d",
  primary300: "#c84b38",
  primary400: "#d5402b",
  primary500: "#8f1d0e",   // surface/primary/default
  primary600: "#9c2414",
  primary700: "#74180b",
  primary800: "#571309",
  primary900: "#310a04",

  // Brand secondary (deep blue) – backgrounds, gradients, structure
  secondary100: "#8e9db9",
  secondary200: "#6e80a3",
  secondary300: "#4f638c",
  secondary400: "#304675",
  secondary500: "#12295d",
  secondary600: "#040e4b",   // surface/secondary subtle alias
  secondary700: "#0c1e48",
  secondary800: "#09193d",
  secondary900: "#061431",   // surface/secondary/default

  // "Brand" green – Merkle's signature green wordmark color
  brandGreen100: "#37956c",
  brandGreen200: "#2c7757",
  brandGreen300: "#256449",
  brandGreen400: "#1d563f",
  brandGreen500: "#154734",  // canonical Merkle green
  brandGreen600: "#133f2e",
  brandGreen700: "#103628",
  brandGreen800: "#0e2f23",
  brandGreen900: "#091f17",

  // Notification – blue
  notificationBlue400: "#cbeaff",
  notificationBlue500: "#0058aa",
  notificationBlue600: "#003a61",

  // Notification – red
  notificationRed400: "#f16f6f",
  notificationRed500: "#db1616",
  notificationRed600: "#910d0d",

  // Notification – green
  notificationGreen400: "#04e200",
  notificationGreen500: "#03aa00",
  notificationGreen600: "#026100",

  // Non-brand neutrals
  nonBrand100: "#ffffff",
  nonBrand200: "#fbfafb",
  nonBrand300: "#f8f7f5",

  // Neutrals
  white: "#ffffff",
  black: "#000000",

  // Typography – Proxima Nova family + responsive scale (large viewport)
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

  // Semantic tokens – name → resolved hex, mirrors the Semantic collection.
  // Use these in component code; switch the source palette by changing
  // these values rather than every consumer.
  semantic: {
    surfacePrimaryDefault:    "#8f1d0e", // → primary500
    surfacePrimarySubtle:     "#c84b38", // → primary300
    surfacePrimaryMinimal:    "#ff7c6d", // → primary200
    surfaceSecondaryDefault:  "#061431", // → secondary900
    surfaceSecondarySubtle:   "#4f638c", // → secondary300
    surfaceNeutralDefault:    "#051027",
    surfaceContrastDefault:   "#ffffff",
    onNeutralEmphasis:        "#ffffff",
    onNeutralDefault:         "#ececec", // → grey70
    onNeutralAccent:          "#c84b38", // → primary300 on dark navy
  },
} as const;

// ── DENTSU – DDS Light theme ───────────────────────────────────────
// Pulled from Primitive: Color (mode "DDS"), Semantic: Color (mode
// "Light | Connect 3.0"), Border radius, and Primitive: Spacing in the
// DDS-Tokens Figma file. The dark mode equivalents live in the same
// file under "Dark | Connect 3.0" – we ship Light only for now.
export const DENTSU = {
  // ── Backgrounds + structural surfaces ─────────────────────────
  bgBase: "#f7f7f8",            // Neutral/50 – page background
  bgInverse: "#040406",         // Neutral/1350 – inverse surface
  surface1: "#ffffff",          // Neutral/0
  surface2: "#fafafb",          // Neutral/25
  surface3: "#f7f7f8",          // Neutral/50
  surfaceGlobalHeader: "#040406", // Neutral/1350
  surfaceSideMenu: "#434357",     // Neutral/800

  // ── Primary brand accent – DDS dark mono ──────────────────────
  fillAccent1: "#0d0d11",       // Neutral/1250
  fillAccent1Hover: "#2c2c3a",  // Neutral/1000
  fillAccent1Pressed: "#373748", // Neutral/900

  // ── Secondary brand accent – DDS Blue ─────────────────────────
  fillAccent2: "#076cdf",       // Blue/500

  // Full Neutral scale
  neutral0: "#ffffff",
  neutral25: "#fafafb",
  neutral50: "#f7f7f8",
  neutral100: "#eeeef1",
  neutral150: "#e5e5e9",
  neutral200: "#dedee4",
  neutral250: "#d6d6dd",
  neutral300: "#ceced6",
  neutral350: "#c6c6d0",
  neutral400: "#bebec9",
  neutral450: "#b6b6c2",
  neutral500: "#aeaebc",
  neutral550: "#9f9fb1",
  neutral600: "#9090a4",
  neutral650: "#7f7f97",
  neutral700: "#60607b",
  neutral750: "#52526b",
  neutral800: "#434357",
  neutral850: "#3e3e51",
  neutral900: "#373748",
  neutral950: "#31313f",
  neutral1000: "#2c2c3a",
  neutral1050: "#262631",
  neutral1100: "#21212b",
  neutral1150: "#1b1b23",
  neutral1200: "#16161d",
  neutral1250: "#0d0d11",
  neutral1300: "#070709",
  neutral1350: "#040406",

  // Full Blue scale
  blue0: "#fafcfe",
  blue25: "#f2f7fd",
  blue50: "#e6f0fb",
  blue100: "#cde1f8",
  blue150: "#b5d3f5",
  blue200: "#9bc4f2",
  blue300: "#6aa6eb",
  blue400: "#3889e5",
  blue500: "#076cdf",
  blue550: "#0660c8",
  blue600: "#0556b2",
  blue650: "#044b9b",
  blue700: "#044085",
  blue750: "#03356f",
  blue800: "#022b59",
  blue850: "#022042",
  blue900: "#01152c",

  // Status – Red
  red100: "#f9e0de",
  red200: "#f1aba7",
  red400: "#e2574d",
  red500: "#dc2f23",
  red600: "#b0251c",
  red700: "#841c15",

  // Status – Green
  green100: "#e2f8ec",
  green200: "#9feac1",
  green500: "#3ed483",
  green600: "#31a968",
  green700: "#257f4e",

  // Status – Amber
  amber100: "#fff0e2",
  amber200: "#ffcd9f",
  amber500: "#ff9b3f",
  amber600: "#cc7c32",
  amber700: "#995d25",

  // AI accent – DDS Purple (signature for AI features)
  purple50: "#eee8f9",
  purple100: "#ded1f3",
  purple200: "#bda3e7",
  purple300: "#ad8ce1",
  purple350: "#8c5ed5",
  purple400: "#7b47cf",
  purple500: "#5b19c4",   // aiAccent canonical
  purple550: "#5116b0",
  purple600: "#48149c",
  purple700: "#360f75",

  // Magenta (charts + tertiary brand accent)
  magenta50: "#f5eaf8",
  magenta200: "#daabe6",
  magenta300: "#c781d9",
  magenta500: "#a32dc1",
  magenta700: "#611b73",

  // Turquoise (charts)
  turquoise50: "#e6f9fa",
  turquoise200: "#99e9eb",
  turquoise300: "#66dfe2",
  turquoise500: "#00cacf",
  turquoise600: "#00a1a5",
  turquoise800: "#005052",

  // Yellow (charts + warning highlight)
  yellow200: "#fff7c6",
  yellow500: "#ffeb72",
  yellow700: "#998d44",

  // ── Semantic shortcuts (Light | Connect 3.0) ─────────────────
  textDefault: "#0d0d11",       // Neutral/1250
  textSupportive: "#60607b",    // Neutral/700
  textOnDark: "#ffffff",
  textError: "#b0251c",         // Red/600
  textSuccess: "#257f4e",       // Green/700

  borderDefault: "#ceced6",     // Neutral/300
  borderHover: "#bebec9",       // Neutral/400
  borderFocus: "#0d0d11",
  borderGlobalNav: "#262631",   // Neutral/1050

  // Status palette short names
  errorRed500: "#dc2f23",
  errorRed600: "#b0251c",
  successGreen500: "#3ed483",
  successGreen700: "#257f4e",
  warningAmber500: "#ff9b3f",

  // AI accent shortcuts
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

  // ── Border radius (px) – DDS scale ──────────────────────────
  radius: {
    none: 0,
    "2xs": 2,
    xs: 4,
    sm: 8,    // default
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },

  // ── Border width (px) ───────────────────────────────────────
  borderWidth: {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
  },

  // ── Spacing (px) – Primitive: Spacing scale ─────────────────
  spacing: {
    "0": 0,
    "25": 1,
    "50": 2,
    "100": 4,
    "150": 6,
    "200": 8,
    "250": 10,
    "275": 11,
    "300": 12,
    "350": 14,
    "400": 16,
    "450": 18,
    "500": 20,
    "550": 22,
    "600": 24,
    "700": 28,
    "750": 30,
    "800": 32,
    "900": 36,
    "950": 38,
    "1000": 40,
    "1100": 44,
    "1200": 48,
    "1300": 52,
    "1400": 56,
    "1500": 60,
    "1600": 64,
    "1800": 72,
    "1900": 76,
    "2000": 80,
    "2400": 96,
    "2800": 112,
    "3000": 120,
    "3600": 144,
    "4000": 160,
  },

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
  // Type ramp (px) – straight from DDS Primitive: Typography
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
