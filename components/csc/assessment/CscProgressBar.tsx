"use client";

import { cn } from "@/lib/utils";
import {
  CSC_CAPABILITY_LABELS,
  CSC_CAPABILITY_SUBTITLES,
  CSC_CAPABILITIES_ORDER,
} from "@/lib/csc/data/questions";

interface CscProgressBarProps {
  currentStep: number; // 0 = setup, 1-8 = capabilities, 9 = industry
  totalSteps: number;
  answeredCount: number;
  totalQuestions: number;
  hasIndustry?: boolean;
}

export function CscProgressBar({
  currentStep,
  totalSteps: _totalSteps,
  answeredCount,
  totalQuestions,
  hasIndustry = false,
}: CscProgressBarProps) {
  const pct =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="w-full">
      {/* Step indicators */}
      <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
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

        {CSC_CAPABILITIES_ORDER.map((cap, idx) => {
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
                title={CSC_CAPABILITY_LABELS[cap]}
              >
                {done ? "✓" : stepNum}
              </div>
            </div>
          );
        })}

        {hasIndustry && (
          <div className="flex items-center gap-1">
            <div className="h-0.5 w-4 bg-slate-200 flex-shrink-0" />
            <div
              className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
                currentStep > CSC_CAPABILITIES_ORDER.length + 1
                  ? "bg-blue-600 border-blue-600 text-white"
                  : currentStep === CSC_CAPABILITIES_ORDER.length + 1
                  ? "bg-white border-blue-600 text-blue-600"
                  : "bg-white border-slate-200 text-slate-400"
              )}
              title="Industry Context"
            >
              {currentStep > CSC_CAPABILITIES_ORDER.length + 1
                ? "✓"
                : String(CSC_CAPABILITIES_ORDER.length + 1)}
            </div>
          </div>
        )}
      </div>

      <div className="w-full bg-slate-100 rounded-full h-1.5">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <p className="text-xs text-slate-500">
          {currentStep > 0 && currentStep <= CSC_CAPABILITIES_ORDER.length
            ? `${CSC_CAPABILITY_LABELS[CSC_CAPABILITIES_ORDER[currentStep - 1]]} – ${CSC_CAPABILITY_SUBTITLES[CSC_CAPABILITIES_ORDER[currentStep - 1]]}`
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
