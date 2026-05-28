"use client";

import { useEffect, useRef, useState } from "react";
import type { WaybackRelease } from "@/lib/wayback";

interface TimelapseControlsProps {
  /** Ascending (old → new) */
  releases: WaybackRelease[];
  activeIndex: number;
  onIndexChange: (i: number) => void;
}

export default function TimelapseControls({
  releases,
  activeIndex,
  onIndexChange,
}: TimelapseControlsProps) {
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep a stable ref to the latest values so the interval callback never
  // needs to be recreated on each tick (which was killing playback).
  const stateRef = useRef({ activeIndex, releasesLength: releases.length, onIndexChange });
  useEffect(() => {
    stateRef.current = { activeIndex, releasesLength: releases.length, onIndexChange };
  });

  // Stop playing when the release list identity changes (area / year-range switch).
  // With timeline memoised in the parent this only fires on real changes.
  useEffect(() => {
    setPlaying(false);
  }, [releases]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        const { activeIndex: idx, releasesLength: len, onIndexChange: onChange } = stateRef.current;
        onChange((idx + 1) % len);
      }, 1200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]); // only start/stop when play state toggles

  if (releases.length === 0) return null;

  const active = releases[activeIndex];

  // Build year-milestone positions: for each calendar year, find the first index
  const yearMilestones: { year: number; pct: number }[] = [];
  let lastYear = -1;
  releases.forEach((r, i) => {
    const yr = Number(r.date.slice(0, 4));
    if (yr !== lastYear) {
      yearMilestones.push({ year: yr, pct: (i / Math.max(releases.length - 1, 1)) * 100 });
      lastYear = yr;
    }
  });

  return (
    /* Overlay: absolute bottom-center of the map container */
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[min(480px,calc(100%-2rem))]">
      <div className="rounded-2xl bg-black/75 backdrop-blur-md border border-white/12 px-4 pt-3 pb-4 shadow-2xl flex flex-col gap-3">

        {/* Active date badge + play */}
        <div className="flex items-center justify-between">
          <span className="text-cyan-400 font-bold text-sm tracking-wide">
            {active?.date.slice(0, 7) ?? "—"}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{releases.length} captures</span>
            <button
              onClick={() => setPlaying((p) => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-medium hover:bg-cyan-500/25 transition"
            >
              {playing ? (
                <>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <rect x="1" y="1" width="3" height="8" rx="0.5"/>
                    <rect x="6" y="1" width="3" height="8" rx="0.5"/>
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M2 1l7 4-7 4V1z"/>
                  </svg>
                  Play
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scrubber track */}
        <div className="relative">
          <input
            type="range"
            min={0}
            max={Math.max(releases.length - 1, 0)}
            value={activeIndex}
            onChange={(e) => {
              setPlaying(false);
              onIndexChange(Number(e.target.value));
            }}
            className="w-full cursor-pointer accent-cyan-400"
            style={{ height: 4 }}
          />

          {/* Year milestone labels below the track */}
          <div className="relative mt-1.5" style={{ height: 14 }}>
            {yearMilestones.map(({ year, pct }) => (
              <span
                key={year}
                className="absolute text-[10px] text-slate-500 -translate-x-1/2 select-none"
                style={{ left: `${pct}%` }}
              >
                {year}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
