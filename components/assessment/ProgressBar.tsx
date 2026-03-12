"use client";

import { cn } from "@/lib/utils";
import { CAPABILITY_LABELS, CAPABILITY_SUBTITLES, CAPABILITIES_ORDER } from "@/lib/data/questions";
import type { Capability } from "@/lib/types";

interface ProgressBarProps {
  currentStep: number; // 0 = setup, 1-6 = capabilities, 7 = industry
  totalSteps: number;
  answeredCount: number;
  totalQuestions: number;
}

export function ProgressBar({
  currentStep,
  totalSteps,
  answeredCount,
  totalQuestions,
}: ProgressBarProps) {
  const pct = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="w-full">
      {/* Step indicators */}
      <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
        {/* Setup step */}
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
            currentStep > 0
              ? "bg-blue-600 border-blue-600 text-white"
              : currentStep === 0
              ? "bg-white border-blue-600 text-blue-600"
              : "bg-white border-slate-200 text-slate-400"
          )}
        >
          {currentStep > 0 ? "✓" : "0"}
        </div>

        {CAPABILITIES_ORDER.map((cap, idx) => {
          const stepNum = idx + 1;
          const done = currentStep > stepNum;
          const active = currentStep === stepNum;
          return (
            <div key={cap} className="flex items-center gap-1">
              <div className="h-0.5 w-4 bg-slate-200 flex-shrink-0" />
              <div
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
                  done
                    ? "bg-blue-600 border-blue-600 text-white"
                    : active
                    ? "bg-white border-blue-600 text-blue-600"
                    : "bg-white border-slate-200 text-slate-400"
                )}
                title={CAPABILITY_LABELS[cap]}
              >
                {done ? "✓" : stepNum}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <p className="text-xs text-slate-500">
          {currentStep > 0 && currentStep <= 6
            ? `${CAPABILITY_LABELS[CAPABILITIES_ORDER[currentStep - 1]]} — ${CAPABILITY_SUBTITLES[CAPABILITIES_ORDER[currentStep - 1]]}`
            : currentStep === 0
            ? "Getting started"
            : "Industry context"}
        </p>
        <p className="text-xs text-slate-500">
          {answeredCount}/{totalQuestions} questions answered
        </p>
      </div>
    </div>
  );
}
