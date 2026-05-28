export type DashboardTheme = "urban_growth" | "greenery" | "water_body" | "general";

export interface AreaMetrics {
  year: number;
  ndvi?: number;
  water_area_km2?: number;
  built_pct?: number;
}

export interface CuratedArea {
  slug: string;
  name: string;
  city: string;
  state: string;
  description: string;
  lat: number;
  lon: number;
  zoom: number;
  /** [west, south, east, north] — drives AOI outline + fitBounds */
  bbox?: [number, number, number, number];
  featured?: boolean;
  availableThemes: DashboardTheme[];
  yearRange: [number, number];
  metrics: Partial<Record<DashboardTheme, AreaMetrics[]>>;
}

// All metrics computed from real Sentinel-2 GEE data (dry-season composites, 30m resolution)
export const CURATED_AREAS: CuratedArea[] = [
  {
    slug: "bellandur-lake",
    name: "Bellandur Lake",
    city: "Bengaluru",
    state: "Karnataka",
    description: "Once one of Bengaluru's largest lakes, now surrounded by tech parks and residential sprawl.",
    lat: 12.9336,
    lon: 77.6679,
    zoom: 13,
    bbox: [77.6479, 12.9136, 77.6879, 12.9536],
    featured: true,
    availableThemes: ["water_body", "urban_growth", "general"],
    yearRange: [2016, 2024],
    metrics: {
      water_body: [
        { year: 2016, water_area_km2: 1.120, built_pct: 61.9, ndvi: 0.3243 },
        { year: 2017, water_area_km2: 1.192, built_pct: 63.7, ndvi: 0.3214 },
        { year: 2018, water_area_km2: 0.620, built_pct: 69.0, ndvi: 0.2888 },
        { year: 2019, water_area_km2: 0.494, built_pct: 62.5, ndvi: 0.3259 },
        { year: 2020, water_area_km2: 0.201, built_pct: 54.5, ndvi: 0.3589 },
        { year: 2021, water_area_km2: 0.342, built_pct: 59.9, ndvi: 0.3387 },
        { year: 2022, water_area_km2: 0.239, built_pct: 56.1, ndvi: 0.3385 },
        { year: 2023, water_area_km2: 0.514, built_pct: 68.2, ndvi: 0.2786 },
        { year: 2024, water_area_km2: 0.669, built_pct: 54.3, ndvi: 0.3427 },
      ],
      urban_growth: [
        { year: 2016, built_pct: 61.9, ndvi: 0.3243 },
        { year: 2018, built_pct: 69.0, ndvi: 0.2888 },
        { year: 2020, built_pct: 54.5, ndvi: 0.3589 },
        { year: 2022, built_pct: 56.1, ndvi: 0.3385 },
        { year: 2024, built_pct: 54.3, ndvi: 0.3427 },
      ],
    },
  },
  {
    slug: "whitefield",
    name: "Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    description: "A sleepy neighbourhood that became one of India's largest IT corridors in under 20 years.",
    lat: 12.9698,
    lon: 77.7499,
    zoom: 13,
    bbox: [77.7299, 12.9498, 77.7699, 12.9898],
    featured: true,
    availableThemes: ["urban_growth", "greenery", "general"],
    yearRange: [2016, 2024],
    metrics: {
      urban_growth: [
        { year: 2016, built_pct: 55.4, ndvi: 0.3796 },
        { year: 2017, built_pct: 59.9, ndvi: 0.3601 },
        { year: 2018, built_pct: 67.9, ndvi: 0.3123 },
        { year: 2019, built_pct: 67.1, ndvi: 0.3198 },
        { year: 2020, built_pct: 57.9, ndvi: 0.3621 },
        { year: 2021, built_pct: 64.3, ndvi: 0.3401 },
        { year: 2022, built_pct: 59.4, ndvi: 0.3509 },
        { year: 2023, built_pct: 71.0, ndvi: 0.2941 },
        { year: 2024, built_pct: 63.7, ndvi: 0.3290 },
      ],
      greenery: [
        { year: 2016, ndvi: 0.3796 },
        { year: 2018, ndvi: 0.3123 },
        { year: 2020, ndvi: 0.3621 },
        { year: 2022, ndvi: 0.3509 },
        { year: 2024, ndvi: 0.3290 },
      ],
    },
  },
  {
    slug: "kempegowda-airport-area",
    name: "Kempegowda Airport Corridor",
    city: "Bengaluru",
    state: "Karnataka",
    description: "Agricultural land rapidly converted to aerospace & logistics hubs following airport construction.",
    lat: 13.1986,
    lon: 77.7066,
    zoom: 12,
    bbox: [77.6666, 13.1586, 77.7466, 13.2386],
    featured: true,
    availableThemes: ["urban_growth", "greenery", "general"],
    yearRange: [2016, 2024],
    metrics: {
      urban_growth: [
        { year: 2016, built_pct: 84.9, ndvi: 0.3042 },
        { year: 2017, built_pct: 84.1, ndvi: 0.2857 },
        { year: 2018, built_pct: 90.9, ndvi: 0.2297 },
        { year: 2019, built_pct: 88.3, ndvi: 0.2598 },
        { year: 2020, built_pct: 84.1, ndvi: 0.2970 },
        { year: 2021, built_pct: 81.5, ndvi: 0.2932 },
        { year: 2022, built_pct: 75.1, ndvi: 0.3210 },
        { year: 2023, built_pct: 84.7, ndvi: 0.2597 },
        { year: 2024, built_pct: 79.8, ndvi: 0.2972 },
      ],
      greenery: [
        { year: 2016, ndvi: 0.3042 },
        { year: 2018, ndvi: 0.2297 },
        { year: 2020, ndvi: 0.2970 },
        { year: 2022, ndvi: 0.3210 },
        { year: 2024, ndvi: 0.2972 },
      ],
    },
  },
];

export function getAreaBySlug(slug: string): CuratedArea | undefined {
  return CURATED_AREAS.find((a) => a.slug === slug);
}

export function getFeaturedAreas(): CuratedArea[] {
  return CURATED_AREAS.filter((a) => a.featured);
}

/** Derive a rough bbox from center + zoom if none stored */
export function bboxForArea(area: CuratedArea): [number, number, number, number] {
  if (area.bbox) return area.bbox;
  const pad = area.zoom >= 14 ? 0.01 : area.zoom >= 12 ? 0.02 : 0.05;
  return [area.lon - pad, area.lat - pad, area.lon + pad, area.lat + pad];
}
