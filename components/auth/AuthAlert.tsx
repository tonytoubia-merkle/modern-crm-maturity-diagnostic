"use client";

/**
 * Inline alert card used by /login and /register in place of native
 * browser popups. Three tones cover the auth flow signals:
 *
 *   - "domain"  – amber, wrong-domain warning. No CTA.
 *   - "info"    – blue, account-status nudge with a link to the
 *                 partner page (e.g. "no account? register here").
 *   - "error"   – red, generic auth failure with the raw message.
 *
 * Visuals deliberately calmer than a browser dialog – these read as
 * helpful next steps, not blockers.
 */

type Tone = "domain" | "info" | "error" | "success";

interface AuthAlertProps {
  tone: Tone;
  title: string;
  body: React.ReactNode;
  action?: { label: string; href: string };
}

const STYLES: Record<
  Tone,
  { container: string; icon: string; titleColor: string; iconPath: string }
> = {
  domain: {
    container: "bg-amber-50 border-amber-200",
    icon: "text-amber-600",
    titleColor: "text-amber-900",
    // ! triangle
    iconPath:
      "M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z",
  },
  info: {
    container: "bg-blue-50 border-blue-200",
    icon: "text-m2-blue",
    titleColor: "text-m2-blue",
    // i info
    iconPath:
      "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  error: {
    container: "bg-red-50 border-red-200",
    icon: "text-red-600",
    titleColor: "text-red-700",
    // x circle
    iconPath:
      "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  success: {
    container: "bg-green-50 border-green-200",
    icon: "text-green-600",
    titleColor: "text-green-700",
    // check circle
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
};

export function AuthAlert({ tone, title, body, action }: AuthAlertProps) {
  const style = STYLES[tone];
  return (
    <div
      role="alert"
      className={`flex gap-3 border rounded-lg px-3 py-2.5 ${style.container}`}
    >
      <svg
        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${style.icon}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={style.iconPath}
        />
      </svg>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold ${style.titleColor}`}>{title}</p>
        <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
          {body}
        </div>
        {action && (
          <a
            href={action.href}
            className={`inline-flex items-center gap-1 text-xs font-semibold mt-2 hover:underline ${style.titleColor}`}
          >
            {action.label}
            <span aria-hidden>→</span>
          </a>
        )}
      </div>
    </div>
  );
}
