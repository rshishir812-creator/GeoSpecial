"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { WaybackRelease } from "@/lib/wayback";
import { buildInitialStyle, ESRI_SAT_ID, CARTO_VOYAGER_ID, type ViewMode } from "@/lib/basemaps";

interface MapViewProps {
  lat: number;
  lon: number;
  zoom: number;
  bbox?: [number, number, number, number];
  areaName?: string;
  activeRelease: WaybackRelease | null;
  viewMode?: ViewMode;
  showBoundaries?: boolean;
  onMapClick?: (lat: number, lon: number) => void;
}

// Layer / source IDs
const WB_A = "wayback-a";
const WB_B = "wayback-b";
const AOI_SRC = "aoi-src";
const AOI_GLOW = "aoi-glow";
const AOI_FILL = "aoi-fill";
const AOI_LINE = "aoi-line";
const BOUNDS_SRC = "india-states";
const BOUNDS_LINE = "india-states-line";

function bboxPolygon(bbox: [number, number, number, number]) {
  const [w, s, e, n] = bbox;
  return {
    type: "Feature" as const,
    properties: {},
    geometry: {
      type: "Polygon" as const,
      coordinates: [[[w, s], [e, s], [e, n], [w, n], [w, s]]],
    },
  };
}

export default function MapView({
  lat,
  lon,
  zoom,
  bbox,
  areaName,
  activeRelease,
  viewMode = "satellite",
  showBoundaries = false,
  onMapClick,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const loadedRef = useRef(false);
  // Crossfade refs
  const currLayerRef = useRef<typeof WB_A | typeof WB_B>(WB_A);
  const fadingRef = useRef(false);
  const lastUrlRef = useRef<string>("");
  const markerRef = useRef<maplibregl.Marker | null>(null);

  // ── Init (once) ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildInitialStyle(),
      center: [lon, lat],
      zoom,
      attributionControl: false,
      pitchWithRotate: false,
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: "metric" }), "bottom-left");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    map.on("click", (e) => onMapClick?.(e.lngLat.lat, e.lngLat.lng));

    map.on("load", () => {
      loadedRef.current = true;

      // AOI layers (GeoJSON, empty initially)
      map.addSource(AOI_SRC, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({ id: AOI_GLOW, type: "line", source: AOI_SRC, paint: { "line-color": "#00d2ff", "line-width": 10, "line-blur": 8, "line-opacity": 0.35 } });
      map.addLayer({ id: AOI_FILL, type: "fill", source: AOI_SRC, paint: { "fill-color": "#00d2ff", "fill-opacity": 0.05 } });
      map.addLayer({ id: AOI_LINE, type: "line", source: AOI_SRC, paint: { "line-color": "#00d2ff", "line-width": 1.5, "line-opacity": 0.9 } });

      // State boundaries (always present, toggled by visibility)
      map.addSource(BOUNDS_SRC, { type: "geojson", data: "/data/india-states.geojson" });
      map.addLayer({
        id: BOUNDS_LINE,
        type: "line",
        source: BOUNDS_SRC,
        paint: { "line-color": "#ffffff", "line-width": 0.8, "line-opacity": 0.22 },
        layout: { visibility: showBoundaries ? "visible" : "none" },
      });

      // Apply any prop values that arrived before load
      applyViewMode(map, viewMode);
      if (bbox) drawAOI(map, bbox, areaName);
    });

    return () => {
      loadedRef.current = false;
      markerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── View-mode: flip visibility, never setStyle ───────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!loadedRef.current) return; // will be applied inside the load handler
    applyViewMode(map, viewMode);
  }, [viewMode]);

  // ── Camera: fitBounds or flyTo ───────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (bbox) {
      map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {
        padding: 60,
        duration: 1300,
        maxZoom: 17,
      });
    } else {
      map.flyTo({ center: [lon, lat], zoom, duration: 1200 });
    }
  }, [lat, lon, zoom, bbox]);

  // ── AOI outline + marker ─────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => drawAOI(map, bbox, areaName);
    if (!loadedRef.current) { map.once("load", apply); return; }
    apply();
  }, [bbox, areaName]);

  // ── Boundaries visibility ────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) return;
    if (!map.getLayer(BOUNDS_LINE)) return;
    map.setLayoutProperty(BOUNDS_LINE, "visibility", showBoundaries ? "visible" : "none");
  }, [showBoundaries]);

  // ── Wayback crossfade ────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activeRelease) return;
    if (activeRelease.tileUrl === lastUrlRef.current) return;
    const apply = () => loadRelease(map, activeRelease.tileUrl);
    if (!loadedRef.current) { map.once("load", apply); return; }
    apply();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRelease]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  function applyViewMode(map: maplibregl.Map, mode: ViewMode) {
    if (!map.getLayer(ESRI_SAT_ID) || !map.getLayer(CARTO_VOYAGER_ID)) return;
    map.setLayoutProperty(ESRI_SAT_ID, "visibility", mode === "satellite" ? "visible" : "none");
    map.setLayoutProperty(CARTO_VOYAGER_ID, "visibility", mode === "streets" ? "visible" : "none");
  }

  function ensureWaybackLayer(map: maplibregl.Map, id: string, tileUrl: string) {
    if (!map.getSource(id)) {
      map.addSource(id, { type: "raster", tiles: [tileUrl], tileSize: 256 });
      map.addLayer(
        { id, type: "raster", source: id, paint: { "raster-opacity": 0 } },
        // Insert below AOI glow so wayback is under the AOI outline
        AOI_GLOW,
      );
    }
  }

  function loadRelease(map: maplibregl.Map, tileUrl: string) {
    if (fadingRef.current) return;
    lastUrlRef.current = tileUrl;

    const next = currLayerRef.current === WB_A ? WB_B : WB_A;
    const curr = currLayerRef.current;

    // Ensure both layers exist with valid tile URLs
    ensureWaybackLayer(map, WB_A, tileUrl);
    ensureWaybackLayer(map, WB_B, tileUrl);

    // Point the incoming layer at the new tiles
    try {
      (map.getSource(next) as maplibregl.RasterTileSource).setTiles([tileUrl]);
    } catch { return; }

    fadingRef.current = true;
    let t = 0;
    const DURATION = 400;
    const start = performance.now();

    function tick() {
      t = Math.min(1, (performance.now() - start) / DURATION);
      const ease = t * t * (3 - 2 * t); // smooth-step
      try {
        map.setPaintProperty(next, "raster-opacity", ease);
        map.setPaintProperty(curr, "raster-opacity", 1 - ease);
      } catch { /* layer not yet painted */ }

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        currLayerRef.current = next;
        fadingRef.current = false;
        // Leave old layer's tiles in place (no empty-string reset → no decode error)
        try { map.setPaintProperty(curr, "raster-opacity", 0); } catch { /**/ }
      }
    }
    requestAnimationFrame(tick);
  }

  function drawAOI(map: maplibregl.Map, b?: [number, number, number, number], name?: string) {
    markerRef.current?.remove();
    markerRef.current = null;

    const src = map.getSource(AOI_SRC) as maplibregl.GeoJSONSource | undefined;
    if (!src) return;

    if (!b) {
      src.setData({ type: "FeatureCollection", features: [] });
      return;
    }

    src.setData({ type: "FeatureCollection", features: [bboxPolygon(b)] });

    const cLon = (b[0] + b[2]) / 2;
    const cLat = (b[1] + b[3]) / 2;

    const el = document.createElement("div");
    el.style.cssText =
      "width:10px;height:10px;border-radius:50%;background:#00d2ff;" +
      "box-shadow:0 0 0 3px rgba(0,210,255,0.25),0 0 14px rgba(0,210,255,0.55);cursor:default;";

    markerRef.current = new maplibregl.Marker({ element: el })
      .setLngLat([cLon, cLat])
      .addTo(map);

    if (name) {
      const popup = new maplibregl.Popup({
        offset: 14,
        closeButton: false,
        closeOnClick: false,
      }).setHTML(
        `<span style="font-size:11px;font-weight:600;color:#00d2ff;white-space:nowrap">${name}</span>`,
      );
      markerRef.current.setPopup(popup).togglePopup();
    }
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {/* Subtle bottom fade only */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
        style={{ background: "linear-gradient(to top, rgba(10,10,15,0.55), transparent)" }}
      />
    </div>
  );
}
