"use client";

import type { VoiceState } from "@/lib/chat/useVoice";

interface VoiceOrbProps {
  state: VoiceState;
  countdown: number; // 0-1, 1 = full
  elapsed: number;
  transcript: string;
  interimText: string;
  onTap: () => void;
  onPause: () => void;
  onResume: () => void;
  onSkipSpeech: () => void;
  onSend: () => void;
}

const SIZE = 80;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const STATE_CONFIG: Record<VoiceState, { ring: string; bg: string; label: string }> = {
  inactive: { ring: "#cbd5e1", bg: "#f1f5f9", label: "Tap to speak" },
  listening: { ring: "#22c55e", bg: "#f0fdf4", label: "Listening..." },
  countdown: { ring: "#f97316", bg: "#fff7ed", label: "" }, // label set dynamically
  paused: { ring: "#94a3b8", bg: "#f8fafc", label: "Take your time" },
  speaking: { ring: "#3b82f6", bg: "#eff6ff", label: "Speaking..." },
  processing: { ring: "#00205B", bg: "#f0f4ff", label: "Thinking..." },
};

export function VoiceOrb({
  state,
  countdown,
  elapsed,
  transcript,
  interimText,
  onTap,
  onPause,
  onResume,
  onSkipSpeech,
  onSend,
}: VoiceOrbProps) {
  const config = STATE_CONFIG[state];
  const dashOffset = state === "countdown"
    ? CIRCUMFERENCE * (1 - countdown)
    : state === "listening" || state === "speaking"
    ? 0
    : CIRCUMFERENCE;

  const countdownSeconds = state === "countdown" ? Math.ceil(countdown * 3) : 0;
  const label = state === "countdown" ? `Sending in ${countdownSeconds}...` : config.label;

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center gap-2 py-3">
      {/* Live transcript */}
      {(state === "listening" || state === "countdown" || state === "paused") && (transcript || interimText) && (
        <div className="max-w-md w-full px-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 leading-relaxed">
            {transcript}
            {interimText && (
              <span className="text-slate-400">{transcript ? " " : ""}{interimText}</span>
            )}
          </div>
        </div>
      )}

      {/* Orb */}
      <button
        onClick={() => {
          if (state === "inactive") onTap();
          else if (state === "speaking") onSkipSpeech();
          else if (state === "listening" || state === "countdown") onSend();
        }}
        className="relative flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        style={{ width: SIZE, height: SIZE }}
      >
        {/* Ring SVG */}
        <svg
          width={SIZE}
          height={SIZE}
          className="absolute inset-0"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background ring */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={STROKE}
          />
          {/* Active ring */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={config.ring}
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-100"
          />
        </svg>

        {/* Center circle */}
        <div
          className="rounded-full flex items-center justify-center transition-colors"
          style={{
            width: SIZE - STROKE * 4,
            height: SIZE - STROKE * 4,
            backgroundColor: config.bg,
          }}
        >
          {state === "listening" && (
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          )}
          {state === "countdown" && (
            <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          )}
          {state === "paused" && (
            <svg className="w-6 h-6 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          )}
          {state === "speaking" && (
            <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
          {state === "processing" && (
            <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          )}
          {state === "inactive" && (
            <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          )}
        </div>

        {/* Pulse animation for listening */}
        {state === "listening" && (
          <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-20" />
        )}
      </button>

      {/* Label + timer */}
      <div className="text-center">
        <p className={`text-xs font-medium ${
          state === "countdown" ? "text-orange-600" :
          state === "listening" ? "text-green-600" :
          state === "speaking" ? "text-blue-600" :
          "text-slate-500"
        }`}>
          {label}
        </p>
        {(state === "listening" || state === "countdown" || state === "paused") && (
          <p className="text-[10px] text-slate-400 mt-0.5">{formatTime(elapsed)}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {state === "countdown" && (
          <button
            onClick={(e) => { e.stopPropagation(); onPause(); }}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors"
          >
            Still thinking...
          </button>
        )}
        {state === "paused" && (
          <button
            onClick={(e) => { e.stopPropagation(); onResume(); }}
            className="text-xs font-medium px-3 py-1.5 rounded-full text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "#00205B" }}
          >
            Ready →
          </button>
        )}
        {state === "speaking" && (
          <button
            onClick={(e) => { e.stopPropagation(); onSkipSpeech(); }}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors"
          >
            Skip →
          </button>
        )}
        {(state === "listening" || state === "countdown") && transcript && (
          <button
            onClick={(e) => { e.stopPropagation(); onSend(); }}
            className="text-xs font-medium px-3 py-1.5 rounded-full text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "#00205B" }}
          >
            Send →
          </button>
        )}
      </div>
    </div>
  );
}
