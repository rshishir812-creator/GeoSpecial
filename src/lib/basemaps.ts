import type maplibregl from "maplibre-gl";

export type ViewMode = "satellite" | "streets";

export const ESRI_SAT_ID = "esri-satellite";
export const CARTO_VOYAGER_ID = "carto-voyager";

// One style containing BOTH base layers. View-mode switching flips visibility — never setStyle.
export function buildInitialStyle(): maplibregl.StyleSpecification {
  return {
    version: 8,
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    sources: {
      [ESRI_SAT_ID]: {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution: "© Esri, Maxar, Earthstar Geographics",
        maxzoom: 19,
      },
      [CARTO_VOYAGER_ID]: {
        type: "raster",
        // Drop {r} — MapLibre doesn't support it; use @2x explicitly for retina
        tiles: [
          "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
          "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
          "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        ],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors © CARTO",
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: ESRI_SAT_ID,
        type: "raster",
        source: ESRI_SAT_ID,
        layout: { visibility: "visible" },
      },
      {
        id: CARTO_VOYAGER_ID,
        type: "raster",
        source: CARTO_VOYAGER_ID,
        layout: { visibility: "none" },
      },
    ],
  };
}
