"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  lat: number;
  lon: number;
  zoom: number;
  beforeLabel?: string;
  afterLabel?: string;
}

function tileUrl(template: string, z: number, x: number, y: number) {
  return template.replace("{z}", String(z)).replace("{x}", String(x)).replace("{y}", String(y));
}

function latLonToTile(lat: number, lon: number, zoom: number) {
  const x = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
  const y = Math.floor(
    ((1 -
      Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );
  return { x, y };
}

export default function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  lat,
  lon,
  zoom,
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) {
  const [split, setSplit] = useState(50);
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const tileZoom = Math.min(zoom, 17);
  const { x, y } = latLonToTile(lat, lon, tileZoom);

  const before = tileUrl(beforeUrl, tileZoom, x, y);
  const after = tileUrl(afterUrl, tileZoom, x, y);

  const onMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSplit(pct);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => { if (dragging.current) onMove(e.clientX); };
    const onTouchMove = (e: TouchEvent) => { if (dragging.current) onMove(e.touches[0].clientX); };
    const stop = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchend", stop);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchend", stop);
    };
  }, [onMove]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square rounded-xl overflow-hidden select-none cursor-col-resize bg-black"
    >
      {/* After (full width, clipped left) */}
      <img
        src={after}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      {/* Before (clipped to split %) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${split}%` }}
      >
        <img
          src={before}
          alt={beforeLabel}
          className="absolute inset-0 h-full object-cover"
          style={{ width: `${100 / (split / 100)}%`, maxWidth: "none" }}
          draggable={false}
        />
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
        style={{ left: `${split}%` }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xl"
          onMouseDown={() => { dragging.current = true; }}
          onTouchStart={() => { dragging.current = true; }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 8H1M11 8h4M5 5L2 8l3 3M11 5l3 3-3 3" stroke="#0a0a0f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 text-xs font-semibold text-white/80 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
        {beforeLabel}
      </span>
      <span className="absolute top-3 right-3 text-xs font-semibold text-white/80 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
        {afterLabel}
      </span>
    </div>
  );
}
