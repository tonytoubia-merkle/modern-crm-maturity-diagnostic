import type { Config } from "tailwindcss";

/**
 * Brand tokens are sourced from lib/brand/tokens.ts (M2, MERKLE, DENTSU).
 * Both files are generated from the Figma variable collections — when
 * the brand teams update tokens in Figma, regenerate both, don't
 * hand-edit individual hex values.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Merkle Create default typeface across all Merkle surfaces.
        sans: ['"Work Sans"', "system-ui", "sans-serif"],
        m2: ['"Work Sans"', "system-ui", "sans-serif"],
        merkle: ['"Work Sans"', "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
        // Dentsu DDS surface keeps Inter.
        dentsu: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // ── MERKLE CREATE — semantic design tokens ────────────────
        // https://create.merkle.design. Cobalt primary (#0328D1) already
        // matches the app's accent; these expose the full Create palette.
        create: {
          primary: "#0328d1",
          "primary-hover": "#1e56fa",
          secondary: "#2f98f7",
          tertiary: "#6311cb",
          surface: "#fcfcfc",
          ink: "#1f1f1f",
          "ink-subtle": "#505050",
          border: "#e1e1e1",
          "border-strong": "#cfcfcf",
          "near-black": "#141419",
          success: "#1f9d57",
          warning: "#f0b429",
          error: "#dc4a3d",
          info: "#2f98f7",
        },

        // App brand accent — Merkle Create cobalt ramp. `blue` is
        // overridden to the same ramp so generic blue accents read as the
        // Create primary across every surface.
        brand: {
          50: "#eef2ff",
          100: "#dbe3ff",
          200: "#b8c7ff",
          300: "#8aa3ff",
          400: "#4d6dff",
          500: "#1e56fa",
          600: "#0328d1",
          700: "#0220a6",
          800: "#001a85",
          900: "#00155f",
          950: "#000d3d",
        },
        blue: {
          50: "#eef2ff",
          100: "#dbe3ff",
          200: "#b8c7ff",
          300: "#8aa3ff",
          400: "#4d6dff",
          500: "#1e56fa",
          600: "#0328d1",
          700: "#0220a6",
          800: "#001a85",
          900: "#00155f",
          950: "#000d3d",
        },

        // ── M2 — tool shell (aligned to Merkle Create) ─────────────
        // blue / sky / purple already equal Create primary / secondary /
        // tertiary; dark + neutral surfaces retargeted to Create.
        m2: {
          navy: "#141419",
          blue: "#0328d1",
          "blue-hover": "#1e56fa",
          "blue-alt": "#0220a6",
          cyan: "#16c6d3",
          sky: "#2f98f7",
          purple: "#6311cb",
          text: "#1f1f1f",
          "surface-light": "#f5f5f7",
          "surface-mid": "#e3e3e8",
          white: "#ffffff",
        },

        // ── MERKLE — artifact / output surfaces ────────────────────
        // Pulled from Merkle E-Commerce ARC Core variable collection.
        merkle: {
          surface: "#141419",

          // Greys (full 50–900 scale)
          "grey-50": "#fcfcfc",
          "grey-60": "#f2f1f6",
          "grey-70": "#ececec",
          "grey-80": "#e1e1e1",
          "grey-90": "#d9d9d9",
          "grey-100": "#cfcfcf",
          "grey-200": "#c2c2c2",
          "grey-300": "#b2b2b2",
          "grey-400": "#acacac",
          "grey-500": "#a1a1a1",
          "grey-600": "#5c5c5c",
          "grey-700": "#454545",
          "grey-800": "#2e2e2e",
          "grey-900": "#171717",

          // Primary — retargeted to Merkle Create cobalt (was coral).
          "primary-100": "#b8c7ff",
          "primary-200": "#8aa3ff",
          "primary-300": "#4d6dff",
          "primary-400": "#1e56fa",
          "primary-500": "#0328d1",
          "primary-600": "#0220a6",
          "primary-700": "#001a85",
          "primary-800": "#00155f",
          "primary-900": "#000d3d",

          // Secondary — retargeted to Create near-black neutrals (was deep
          // navy). Drives the dark nav / header surfaces.
          "secondary-100": "#c9cad2",
          "secondary-200": "#9c9ea9",
          "secondary-300": "#6f7280",
          "secondary-400": "#474a57",
          "secondary-500": "#2b2d37",
          "secondary-600": "#141419",
          "secondary-700": "#101015",
          "secondary-800": "#0c0c10",
          "secondary-900": "#08080b",

          // Brand mark green — full scale
          "brand-green-100": "#37956c",
          "brand-green-200": "#2c7757",
          "brand-green-300": "#256449",
          "brand-green-400": "#1d563f",
          "brand-green-500": "#154734",
          "brand-green-600": "#133f2e",
          "brand-green-700": "#103628",
          "brand-green-800": "#0e2f23",
          "brand-green-900": "#091f17",
          // Convenience alias to the canonical green
          "brand-green": "#154734",

          // Notification — blue
          "notification-blue-400": "#cbeaff",
          "notification-blue-500": "#0058aa",
          "notification-blue-600": "#003a61",
          "notification-blue": "#0058aa",

          // Notification — red
          "notification-red-400": "#f16f6f",
          "notification-red-500": "#db1616",
          "notification-red-600": "#910d0d",
          "notification-red": "#db1616",

          // Notification — green
          "notification-green-400": "#04e200",
          "notification-green-500": "#03aa00",
          "notification-green-600": "#026100",
          "notification-green": "#03aa00",

          // Non-brand neutrals
          "non-brand-100": "#ffffff",
          "non-brand-200": "#fbfafb",
          "non-brand-300": "#f8f7f5",
        },

        // ── DENTSU — DDS Light theme ───────────────────────────────
        // Pulled from DDS-Tokens Primitive: Color (mode "DDS").
        dentsu: {
          "bg-base": "#f7f7f8",
          "bg-inverse": "#040406",
          surface: "#ffffff",
          "surface-2": "#fafafb",
          "surface-3": "#f7f7f8",
          "surface-global-header": "#040406",
          "surface-side-menu": "#434357",

          // Brand accents
          "fill-accent-1": "#0d0d11",
          "fill-accent-1-hover": "#2c2c3a",
          "fill-accent-1-pressed": "#373748",
          "fill-accent-2": "#076cdf",

          // Neutral scale (full 0–1350 scale)
          "neutral-0": "#ffffff",
          "neutral-25": "#fafafb",
          "neutral-50": "#f7f7f8",
          "neutral-100": "#eeeef1",
          "neutral-150": "#e5e5e9",
          "neutral-200": "#dedee4",
          "neutral-250": "#d6d6dd",
          "neutral-300": "#ceced6",
          "neutral-350": "#c6c6d0",
          "neutral-400": "#bebec9",
          "neutral-450": "#b6b6c2",
          "neutral-500": "#aeaebc",
          "neutral-550": "#9f9fb1",
          "neutral-600": "#9090a4",
          "neutral-650": "#7f7f97",
          "neutral-700": "#60607b",
          "neutral-750": "#52526b",
          "neutral-800": "#434357",
          "neutral-850": "#3e3e51",
          "neutral-900": "#373748",
          "neutral-950": "#31313f",
          "neutral-1000": "#2c2c3a",
          "neutral-1050": "#262631",
          "neutral-1100": "#21212b",
          "neutral-1150": "#1b1b23",
          "neutral-1200": "#16161d",
          "neutral-1250": "#0d0d11",
          "neutral-1300": "#070709",
          "neutral-1350": "#040406",

          // Blue scale
          "blue-0": "#fafcfe",
          "blue-25": "#f2f7fd",
          "blue-50": "#e6f0fb",
          "blue-100": "#cde1f8",
          "blue-150": "#b5d3f5",
          "blue-200": "#9bc4f2",
          "blue-300": "#6aa6eb",
          "blue-400": "#3889e5",
          "blue-500": "#076cdf",
          "blue-550": "#0660c8",
          "blue-600": "#0556b2",
          "blue-650": "#044b9b",
          "blue-700": "#044085",
          "blue-750": "#03356f",
          "blue-800": "#022b59",
          "blue-850": "#022042",
          "blue-900": "#01152c",

          // Purple scale (AI accent family)
          "purple-50": "#eee8f9",
          "purple-100": "#ded1f3",
          "purple-200": "#bda3e7",
          "purple-300": "#ad8ce1",
          "purple-350": "#8c5ed5",
          "purple-400": "#7b47cf",
          "purple-500": "#5b19c4",
          "purple-550": "#5116b0",
          "purple-600": "#48149c",
          "purple-700": "#360f75",

          // Magenta (charts + tertiary)
          "magenta-50": "#f5eaf8",
          "magenta-200": "#daabe6",
          "magenta-300": "#c781d9",
          "magenta-500": "#a32dc1",
          "magenta-700": "#611b73",

          // Turquoise (charts)
          "turquoise-50": "#e6f9fa",
          "turquoise-200": "#99e9eb",
          "turquoise-300": "#66dfe2",
          "turquoise-500": "#00cacf",
          "turquoise-600": "#00a1a5",
          "turquoise-800": "#005052",

          // Yellow
          "yellow-200": "#fff7c6",
          "yellow-500": "#ffeb72",
          "yellow-700": "#998d44",

          // Status — Red
          "red-100": "#f9e0de",
          "red-200": "#f1aba7",
          "red-400": "#e2574d",
          "red-500": "#dc2f23",
          "red-600": "#b0251c",
          "red-700": "#841c15",

          // Status — Green
          "green-100": "#e2f8ec",
          "green-200": "#9feac1",
          "green-500": "#3ed483",
          "green-600": "#31a968",
          "green-700": "#257f4e",

          // Status — Amber
          "amber-100": "#fff0e2",
          "amber-200": "#ffcd9f",
          "amber-500": "#ff9b3f",
          "amber-600": "#cc7c32",
          "amber-700": "#995d25",

          // Text
          text: "#0d0d11",
          "text-supportive": "#60607b",
          "text-on-dark": "#ffffff",
          "text-error": "#b0251c",
          "text-success": "#257f4e",

          // Borders
          border: "#ceced6",
          "border-hover": "#bebec9",
          "border-focus": "#0d0d11",
          "border-global-nav": "#262631",

          // Status (legacy short names)
          "error-500": "#dc2f23",
          "error-600": "#b0251c",
          "success-500": "#3ed483",
          "success-700": "#257f4e",
          "warning-500": "#ff9b3f",

          // AI accent
          ai: "#5b19c4",
          "ai-hover": "#5116b0",
          "ai-pressed": "#48149c",
        },
      },

      // ── DDS border radius scale ────────────────────────────────
      borderRadius: {
        "dds-none": "0px",
        "dds-2xs": "2px",
        "dds-xs": "4px",
        "dds-sm": "8px",
        "dds-md": "12px",
        "dds-lg": "16px",
        "dds-xl": "20px",
        "dds-full": "9999px",
      },

      // ── DDS border width scale ─────────────────────────────────
      borderWidth: {
        "dds-sm": "1px",
        "dds-md": "2px",
        "dds-lg": "3px",
        "dds-xl": "4px",
      },
    },
  },
  plugins: [],
};

export default config;
