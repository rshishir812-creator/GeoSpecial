"use client";

interface BeforeAfterToggleProps {
  side: "before" | "after";
  beforeLabel: string;
  afterLabel: string;
  onSideChange: (s: "before" | "after") => void;
}

export default function BeforeAfterToggle({
  side,
  beforeLabel,
  afterLabel,
  onSideChange,
}: BeforeAfterToggleProps) {
  return (
    /* Overlay: absolute bottom-center of the map container */
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
      <div className="rounded-2xl bg-black/75 backdrop-blur-md border border-white/12 p-1.5 shadow-2xl flex gap-1">
        <button
          onClick={() => onSideChange("before")}
          className={`flex flex-col items-center px-6 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
            side === "before"
              ? "bg-cyan-500/25 text-cyan-300 border border-cyan-500/40"
              : "text-slate-400 hover:text-slate-200 border border-transparent"
          }`}
        >
          <span className="text-[10px] font-normal text-slate-500 mb-0.5">Before</span>
          {beforeLabel}
        </button>

        {/* Divider arrow */}
        <div className="flex items-center px-1 text-slate-600 text-xs select-none">→</div>

        <button
          onClick={() => onSideChange("after")}
          className={`flex flex-col items-center px-6 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
            side === "after"
              ? "bg-cyan-500/25 text-cyan-300 border border-cyan-500/40"
              : "text-slate-400 hover:text-slate-200 border border-transparent"
          }`}
        >
          <span className="text-[10px] font-normal text-slate-500 mb-0.5">After</span>
          {afterLabel}
        </button>
      </div>
    </div>
  );
}
