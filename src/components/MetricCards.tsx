"use client";

import type { AreaMetrics, DashboardTheme } from "@/data/areas";

interface MetricCardsProps {
  metrics: AreaMetrics[];
  theme: DashboardTheme;
  fromYear: number;
  toYear: number;
}

export default function MetricCards({ metrics, theme, fromYear, toYear }: MetricCardsProps) {
  const filtered = metrics.filter((m) => m.year >= fromYear && m.year <= toYear);
  const first = filtered[0];
  const last = filtered[filtered.length - 1];
  if (!first || !last) return null;

  const cards: { label: string; from: string; to: string; delta: string; positive: boolean }[] = [];

  if (theme === "greenery" || theme === "urban_growth") {
    if (first.ndvi !== undefined && last.ndvi !== undefined) {
      const delta = ((last.ndvi - first.ndvi) / first.ndvi) * 100;
      cards.push({
        label: "Vegetation Cover",
        from: (first.ndvi * 100).toFixed(0) + "%",
        to: (last.ndvi * 100).toFixed(0) + "%",
        delta: (delta > 0 ? "+" : "") + delta.toFixed(1) + "%",
        positive: delta > 0,
      });
    }
    if (first.built_pct !== undefined && last.built_pct !== undefined) {
      const delta = last.built_pct - first.built_pct;
      cards.push({
        label: "Built-up Area",
        from: first.built_pct + "%",
        to: last.built_pct + "%",
        delta: (delta > 0 ? "+" : "") + delta.toFixed(1) + "%",
        positive: delta > 0,
      });
    }
  }

  if (theme === "water_body") {
    if (first.water_area_km2 !== undefined && last.water_area_km2 !== undefined) {
      const delta = last.water_area_km2 - first.water_area_km2;
      cards.push({
        label: "Water Body Area",
        from: first.water_area_km2.toFixed(2) + " km²",
        to: last.water_area_km2.toFixed(2) + " km²",
        delta: (delta > 0 ? "+" : "") + delta.toFixed(2) + " km²",
        positive: delta > 0,
      });
    }
    if (first.built_pct !== undefined && last.built_pct !== undefined) {
      const delta = last.built_pct - first.built_pct;
      cards.push({
        label: "Surrounding Built-up",
        from: first.built_pct + "%",
        to: last.built_pct + "%",
        delta: (delta > 0 ? "+" : "") + delta.toFixed(1) + "%",
        positive: false,
      });
    }
  }

  if (!cards.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col gap-2"
        >
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            {c.label}
          </span>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white">{c.to}</span>
            <span
              className={`text-sm font-semibold mb-0.5 ${
                c.positive ? "text-green-400" : "text-red-400"
              }`}
            >
              {c.delta}
            </span>
          </div>
          <span className="text-xs text-slate-500">
            was {c.from} in {fromYear}
          </span>
        </div>
      ))}
    </div>
  );
}
