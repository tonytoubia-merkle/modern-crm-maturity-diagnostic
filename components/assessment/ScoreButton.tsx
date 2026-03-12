"use client";

import { cn } from "@/lib/utils";
import { SCORE_LABELS, SCORE_DESCRIPTIONS } from "@/lib/data/questions";

interface ScoreButtonProps {
  value: number;
  selected: boolean;
  onClick: (value: number) => void;
}

export function ScoreButton({ value, selected, onClick }: ScoreButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={cn(
        "flex-1 min-w-0 flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-center transition-all duration-150 cursor-pointer group",
        selected
          ? "border-blue-600 bg-blue-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
      )}
    >
      <span
        className={cn(
          "text-xl font-bold",
          selected ? "text-blue-700" : "text-slate-500 group-hover:text-blue-600"
        )}
      >
        {value}
      </span>
      <span
        className={cn(
          "text-xs font-semibold",
          selected ? "text-blue-700" : "text-slate-500 group-hover:text-blue-600"
        )}
      >
        {SCORE_LABELS[value]}
      </span>
      <span
        className={cn(
          "text-xs leading-tight hidden sm:block",
          selected ? "text-blue-600" : "text-slate-400"
        )}
      >
        {SCORE_DESCRIPTIONS[value]}
      </span>
    </button>
  );
}
