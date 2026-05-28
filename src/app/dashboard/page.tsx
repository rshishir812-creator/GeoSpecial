"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { CURATED_AREAS, type CuratedArea, type DashboardTheme, bboxForArea } from "@/data/areas";
import { type WaybackRelease } from "@/lib/wayback";
import type { ViewMode } from "@/lib/basemaps";
import MetricCards from "@/components/MetricCards";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });
const MapControls = dynamic(() => import("@/components/MapControls"), { ssr: false });
const TimelapseControls = dynamic(() => import("@/components/TimelapseControls"), { ssr: false });
const BeforeAfterToggle = dynamic(() => import("@/components/BeforeAfterToggle"), { ssr: false });

const THEME_LABELS: Record<DashboardTheme, string> = {
  urban_growth: "Urban Growth",
  greenery: "Greenery Loss",
  water_body: "Water Bodies",
  general: "General Overview",
};

const YEAR_OPTIONS = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedArea, setSelectedArea] = useState<CuratedArea>(CURATED_AREAS[0]);
  const [theme, setTheme] = useState<DashboardTheme>("urban_growth");
  const [fromYear, setFromYear] = useState(2016);
  const [toYear, setToYear] = useState(2024);

  const [releases, setReleases] = useState<WaybackRelease[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  /** "timelapse" or "before_after" */
  const [view, setView] = useState<"timelapse" | "before_after">("timelapse");
  /** For before/after toggle */
  const [baSide, setBaSide] = useState<"before" | "after">("before");

  const [viewMode, setViewMode] = useState<ViewMode>("satellite");
  const [showBoundaries, setShowBoundaries] = useState(false);

  const [insight, setInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const areaDropdownRef = useRef<HTMLDivElement>(null);

  // Sync URL params on load
  useEffect(() => {
    const slug = searchParams.get("area");
    const t = searchParams.get("theme") as DashboardTheme | null;
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    if (slug) {
      const area = CURATED_AREAS.find((a) => a.slug === slug);
      if (area) setSelectedArea(area);
    }
    if (t) setTheme(t);
    if (from) setFromYear(Number(from));
    if (to) setToYear(Number(to));
  }, [searchParams]);

  // Update URL when selection changes
  useEffect(() => {
    const params = new URLSearchParams({
      area: selectedArea.slug,
      theme,
      from: String(fromYear),
      to: String(toYear),
    });
    router.replace(`/dashboard?${params.toString()}`, { scroll: false });
  }, [selectedArea, theme, fromYear, toYear, router]);

  // Close area dropdown on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (areaDropdownRef.current && !areaDropdownRef.current.contains(e.target as Node)) {
        setAreaOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Fetch Wayback releases once
  useEffect(() => {
    fetch("/api/wayback")
      .then((r) => r.json())
      .then((d) => { if (d.releases) setReleases(d.releases); })
      .catch(console.error);
  }, []);

  // Releases sorted ascending (old → new) filtered to year range
  const timeline: WaybackRelease[] = releases
    .filter((r) => {
      const yr = Number(r.date.slice(0, 4));
      return yr >= fromYear && yr <= toYear;
    })
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Clamp activeIdx when timeline shrinks
  useEffect(() => {
    if (timeline.length > 0 && activeIdx >= timeline.length) {
      setActiveIdx(timeline.length - 1);
    }
  }, [timeline.length, activeIdx]);

  // Derive the release that drives the map
  const beforeRelease = timeline[0] ?? null;
  const afterRelease = timeline[timeline.length - 1] ?? null;

  let activeRelease: WaybackRelease | null = null;
  if (view === "timelapse") {
    activeRelease = timeline[Math.min(activeIdx, timeline.length - 1)] ?? null;
  } else {
    activeRelease = baSide === "before" ? beforeRelease : afterRelease;
  }

  const handleIdxChange = useCallback((i: number) => setActiveIdx(i), []);

  const handleAreaChange = (slug: string) => {
    const a = CURATED_AREAS.find((x) => x.slug === slug);
    if (a) {
      setSelectedArea(a);
      setTheme(a.availableThemes[0]);
      setInsight("");
      setActiveIdx(0);
    }
  };

  const fetchInsight = async () => {
    setLoadingInsight(true);
    setInsight("");
    const firstMetric = selectedArea.metrics[theme]?.[0];
    const lastMetric = selectedArea.metrics[theme]?.slice(-1)[0];
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationName: `${selectedArea.name}, ${selectedArea.city}, ${selectedArea.state}`,
          fromYear,
          toYear,
          theme,
          ndvi_change:
            firstMetric?.ndvi !== undefined && lastMetric?.ndvi !== undefined
              ? lastMetric.ndvi - firstMetric.ndvi
              : undefined,
          water_area_change:
            firstMetric?.water_area_km2 !== undefined && lastMetric?.water_area_km2 !== undefined
              ? lastMetric.water_area_km2 - firstMetric.water_area_km2
              : undefined,
          built_change:
            firstMetric?.built_pct !== undefined && lastMetric?.built_pct !== undefined
              ? lastMetric.built_pct - firstMetric.built_pct
              : undefined,
        }),
      });
      const d = await res.json();
      setInsight(d.insight ?? "");
    } finally {
      setLoadingInsight(false);
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const areaThemes = selectedArea.availableThemes;
  const areaBbox = bboxForArea(selectedArea);

  return (
    <div className="h-screen bg-[#0a0a0f] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <a href="/" className="text-sm font-bold tracking-widest text-cyan-400 uppercase">
          Geo Special
        </a>
        <button
          onClick={() => navigator.clipboard.writeText(shareUrl)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition px-3 py-1.5 rounded-full border border-white/10"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 2h4v4M14 2L8 8M6 4H3a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1v-3"/>
          </svg>
          Share
        </button>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* Controls sidebar */}
        <aside className="lg:w-80 flex-shrink-0 border-r border-white/5 p-5 flex flex-col gap-6 overflow-y-auto lg:h-full">

          {/* Area selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Area</label>
            <div ref={areaDropdownRef} className="relative">
              {/* Trigger */}
              <button
                onClick={() => setAreaOpen((o) => !o)}
                className="w-full flex items-center justify-between bg-[#12121a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white hover:border-cyan-500/40 focus:outline-none focus:border-cyan-500/50 transition"
              >
                <span className="truncate">{selectedArea.name} · {selectedArea.city}</span>
                <svg
                  className={`ml-2 flex-shrink-0 w-4 h-4 text-slate-400 transition-transform ${areaOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                >
                  <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Menu */}
              {areaOpen && (
                <div className="absolute z-50 mt-1 w-full max-h-72 overflow-y-auto rounded-lg border border-white/10 bg-[#12121a] shadow-xl">
                  {CURATED_AREAS.map((a) => (
                    <button
                      key={a.slug}
                      onClick={() => { handleAreaChange(a.slug); setAreaOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm transition ${
                        a.slug === selectedArea.slug
                          ? "bg-cyan-500/15 text-cyan-300"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="font-medium">{a.name}</span>
                      <span className="text-slate-500"> · {a.city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{selectedArea.description}</p>
          </div>

          {/* Dashboard type */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Dashboard Type</label>
            <div className="flex flex-wrap gap-2">
              {areaThemes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    theme === t
                      ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {THEME_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Year range */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Time Range</label>
            <div className="flex items-center gap-2">
              <select
                value={fromYear}
                onChange={(e) => { setFromYear(Number(e.target.value)); setActiveIdx(0); }}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm text-white focus:outline-none"
              >
                {YEAR_OPTIONS.filter((y) => y < toYear).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <span className="text-slate-500 text-sm">→</span>
              <select
                value={toYear}
                onChange={(e) => { setToYear(Number(e.target.value)); setActiveIdx(0); }}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm text-white focus:outline-none"
              >
                {YEAR_OPTIONS.filter((y) => y > fromYear).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Compare mode (timelapse vs before/after) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Compare</label>
            <div className="flex rounded-lg border border-white/10 overflow-hidden">
              {(["timelapse", "before_after"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`flex-1 py-2 text-xs font-medium transition ${
                    view === v ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {v === "timelapse" ? "Timelapse" : "Before / After"}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics */}
          {selectedArea.metrics[theme] && (
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Metrics</label>
              <MetricCards
                metrics={selectedArea.metrics[theme]!}
                theme={theme}
                fromYear={fromYear}
                toYear={toYear}
              />
            </div>
          )}

          {/* AI Insight */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">AI Insight</label>
            {insight ? (
              <p className="text-sm text-slate-300 leading-relaxed">{insight}</p>
            ) : (
              <p className="text-xs text-slate-500">Generate an AI narrative for this change.</p>
            )}
            <button
              onClick={fetchInsight}
              disabled={loadingInsight}
              className="mt-1 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-400 text-xs font-medium hover:bg-violet-500/30 transition disabled:opacity-50"
            >
              {loadingInsight ? "Generating…" : insight ? "Regenerate" : "Generate Insight"}
            </button>
          </div>
        </aside>

        {/* Map fills the rest — must be a positioned block with explicit height for absolute overlays */}
        <main className="flex-1 relative min-h-[60vh] lg:min-h-0 lg:h-full overflow-hidden">
          <MapView
            lat={selectedArea.lat}
            lon={selectedArea.lon}
            zoom={selectedArea.zoom}
            bbox={areaBbox}
            areaName={selectedArea.name}
            activeRelease={activeRelease}
            viewMode={viewMode}
            showBoundaries={showBoundaries}
          />

          {/* Satellite/Map + Boundaries toggles — top-left */}
          <MapControls
            viewMode={viewMode}
            showBoundaries={showBoundaries}
            onViewModeChange={setViewMode}
            onBoundariesChange={setShowBoundaries}
          />

          {/* Active date badge — top-right */}
          {activeRelease && (
            <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur border border-cyan-500/30 text-cyan-400 text-sm font-bold pointer-events-none">
              {activeRelease.date.slice(0, 7)}
            </div>
          )}

          {/* Timelapse slider — bottom-center, on-map overlay */}
          {view === "timelapse" && timeline.length > 0 && (
            <TimelapseControls
              releases={timeline}
              activeIndex={Math.min(activeIdx, timeline.length - 1)}
              onIndexChange={handleIdxChange}
            />
          )}

          {/* Before/After toggle — bottom-center, on-map overlay */}
          {view === "before_after" && beforeRelease && afterRelease && (
            <BeforeAfterToggle
              side={baSide}
              beforeLabel={beforeRelease.date.slice(0, 7)}
              afterLabel={afterRelease.date.slice(0, 7)}
              onSideChange={setBaSide}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-slate-400">Loading…</div>}>
      <DashboardContent />
    </Suspense>
  );
}
