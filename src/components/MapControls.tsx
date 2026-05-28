"use client";

import type { ViewMode } from "@/lib/basemaps";

interface MapControlsProps {
  viewMode: ViewMode;
  showBoundaries: boolean;
  onViewModeChange: (m: ViewMode) => void;
  onBoundariesChange: (v: boolean) => void;
}

const SAT_ICON = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4" />
  </svg>
);

const MAP_ICON = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 3l5-2 4 2 5-2v10l-5 2-4-2-5 2V3z" />
    <path d="M6 1v10M10 3v10" />
  </svg>
);

export default function MapControls({
  viewMode,
  showBoundaries,
  onViewModeChange,
  onBoundariesChange,
}: MapControlsProps) {
  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start">
      {/* Segmented pill: Satellite | Map */}
      <div className="flex rounded-full border border-white/20 overflow-hidden bg-black/70 backdrop-blur-md shadow-xl">
        <button
          onClick={() => onViewModeChange("satellite")}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-colors duration-150 ${
            viewMode === "satellite"
              ? "bg-cyan-500/30 text-cyan-300"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {SAT_ICON}
          Satellite
        </button>
        <div className="w-px bg-white/15 self-stretch" />
        <button
          onClick={() => onViewModeChange("streets")}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-colors duration-150 ${
            viewMode === "streets"
              ? "bg-cyan-500/30 text-cyan-300"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {MAP_ICON}
          Map
        </button>
      </div>

      {/* Boundaries toggle */}
      <button
        onClick={() => onBoundariesChange(!showBoundaries)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors duration-150 backdrop-blur-md shadow-lg ${
          showBoundaries
            ? "bg-white/15 border-white/35 text-white"
            : "bg-black/70 border-white/20 text-slate-400 hover:text-slate-200"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full border transition-colors duration-150 ${
            showBoundaries ? "bg-white border-white" : "bg-transparent border-slate-500"
          }`}
        />
        Boundaries
      </button>
    </div>
  );
}
