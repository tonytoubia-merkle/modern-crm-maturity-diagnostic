import type { Config } from "tailwindcss";

/**
 * Brand tokens are sourced from lib/brand/tokens.ts (M2, MERKLE, DENTSU).
 * The hex values below mirror those token files exactly — keep them in sync.
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
        sans: ["Inter", "system-ui", "sans-serif"],
        m2: ['"Work Sans"', "Inter", "system-ui", "sans-serif"],
        merkle: ['"Proxima Nova"', "Inter", "system-ui", "sans-serif"],
        dentsu: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Legacy app brand color (kept for backwards-compatibility while
        // surfaces are migrated to the M2/Merkle/Dentsu token systems).
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e3a8a",
          900: "#1e3a8a",
        },

        // ── M2 — tool shell ────────────────────────────────────────
        m2: {
          navy: "#05051e",
          blue: "#0328d1",
          "blue-alt": "#1e1eb5",
          cyan: "#16c6d3",
          sky: "#2f98f7",
          purple: "#6311cb",
          text: "#1e1e1e",
          "surface-light": "#edecf3",
          "surface-mid": "#c1cae0",
          white: "#ffffff",
        },

        // ── MERKLE — artifact / output surfaces ────────────────────
        merkle: {
          surface: "#051027",
          // Greys
          "grey-50": "#fcfcfc",
          "grey-60": "#f2f1f6",
          "grey-70": "#ececec",
          "grey-80": "#e1e1e1",
          "grey-100": "#cfcfcf",
          "grey-300": "#b2b2b2",
          "grey-500": "#a1a1a1",
          "grey-600": "#5c5c5c",
          "grey-700": "#454545",
          "grey-800": "#2e2e2e",
          "grey-900": "#171717",
          // Primary (coral)
          "primary-100": "#ff958b",
          "primary-200": "#ff7c6d",
          "primary-300": "#c84b38",
          "primary-400": "#d5402b",
          "primary-500": "#8f1d0e",
          "primary-600": "#9c2414",
          "primary-700": "#74180b",
          // Secondary (deep blue)
          "secondary-100": "#8e9db9",
          "secondary-300": "#4f638c",
          "secondary-500": "#12295d",
          "secondary-600": "#040e4b",
          "secondary-700": "#0c1e48",
          "secondary-900": "#061431",
          // Brand mark green
          "brand-green": "#154734",
          // Notification
          "notification-blue": "#0058aa",
          "notification-green": "#03aa00",
          "notification-red": "#db1616",
        },

        // ── DENTSU — DDS Light theme ───────────────────────────────
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
          // Blue scale
          "blue-50": "#e6f0fb",
          "blue-100": "#cde1f8",
          "blue-300": "#6aa6eb",
          "blue-500": "#076cdf",
          "blue-600": "#0556b2",
          "blue-700": "#044085",
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
          // Status
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
    },
  },
  plugins: [],
};

export default config;
