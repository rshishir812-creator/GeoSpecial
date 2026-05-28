import Link from "next/link";
import { CURATED_AREAS, getFeaturedAreas } from "@/data/areas";

const THEME_LABEL: Record<string, string> = {
  urban_growth: "Urban Growth",
  greenery: "Greenery Loss",
  water_body: "Water Bodies",
  general: "General",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <span className="text-sm font-bold tracking-widest text-cyan-400 uppercase">Geo Special</span>
        <Link
          href="/dashboard"
          className="text-xs px-4 py-2 rounded-full bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
        >
          Open Dashboard
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 gap-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          India-first · Satellite intelligence
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight max-w-3xl">
          See how{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #00d2ff, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            your city
          </span>
          {" "}changed
        </h1>

        <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
          Satellite timelapses, before-and-after comparisons, and AI insights for
          lakes, neighbourhoods and skylines across India.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="px-8 py-3 rounded-full bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition text-sm"
          >
            Explore the Dashboard
          </Link>
          <a
            href="#featured"
            className="px-8 py-3 rounded-full border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition text-sm"
          >
            See featured areas
          </a>
        </div>
      </section>

      {/* Featured areas */}
      <section id="featured" className="px-6 pb-24 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-300">Featured areas</h2>
          <Link href="/dashboard" className="text-xs text-cyan-400 hover:text-cyan-300 transition">
            +{CURATED_AREAS.length - getFeaturedAreas().length > 0 ? `${CURATED_AREAS.length - getFeaturedAreas().length} more` : "all"} across India →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {getFeaturedAreas().map((area) => (
            <Link
              key={area.slug}
              href={`/dashboard?area=${area.slug}&theme=${area.availableThemes[0]}&from=${area.yearRange[0]}&to=${area.yearRange[1]}`}
              className="group rounded-2xl border border-white/5 bg-white/[0.03] hover:border-cyan-500/30 hover:bg-white/[0.06] transition p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">{area.city}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {THEME_LABEL[area.availableThemes[0]]}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition">
                {area.name}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{area.description}</p>
              <div className="flex items-center gap-1 text-xs text-slate-600 mt-auto">
                <span>{area.yearRange[0]}</span>
                <span>→</span>
                <span>{area.yearRange[1]}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-6 flex items-center justify-between text-xs text-slate-600">
        <span>© 2025 Geo Special</span>
        <span>Satellite data: Esri Wayback · AI: Groq</span>
      </footer>
    </div>
  );
}
