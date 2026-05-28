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

  // ── 10 nationally recognizable transformation sites ──────────────────────

  {
    slug: "statue-of-unity",
    name: "Statue of Unity",
    city: "Kevadia",
    state: "Gujarat",
    description: "A barren Narmada riverbank transformed into the world's tallest statue complex, tourist township, and the 'Valley of Flowers' gardens — built 2014–2018. Metrics are illustrative.",
    lat: 21.8380,
    lon: 73.7190,
    zoom: 14,
    bbox: [73.6990, 21.8180, 73.7390, 21.8580],
    featured: true,
    availableThemes: ["urban_growth", "greenery", "general"],
    yearRange: [2016, 2024],
    metrics: {
      urban_growth: [
        { year: 2016, built_pct: 8.2, ndvi: 0.4210 },
        { year: 2018, built_pct: 22.5, ndvi: 0.3980 },
        { year: 2020, built_pct: 38.1, ndvi: 0.4390 },
        { year: 2022, built_pct: 45.6, ndvi: 0.4560 },
        { year: 2024, built_pct: 49.3, ndvi: 0.4720 },
      ],
      greenery: [
        { year: 2016, ndvi: 0.4210 },
        { year: 2018, ndvi: 0.3980 },
        { year: 2020, ndvi: 0.4390 },
        { year: 2022, ndvi: 0.4560 },
        { year: 2024, ndvi: 0.4720 },
      ],
    },
  },

  {
    slug: "mumbai-coastal-road",
    name: "Mumbai Coastal Road & Worli Sea Link",
    city: "Mumbai",
    state: "Maharashtra",
    description: "New land reclaimed from the Arabian Sea for the 29 km coastal freeway — one of the largest sea reclamation projects in Indian history. Metrics are illustrative.",
    lat: 18.9750,
    lon: 72.8050,
    zoom: 13,
    bbox: [72.7850, 18.9550, 72.8250, 18.9950],
    featured: true,
    availableThemes: ["urban_growth", "water_body", "general"],
    yearRange: [2016, 2024],
    metrics: {
      urban_growth: [
        { year: 2016, built_pct: 52.3, ndvi: 0.1820 },
        { year: 2018, built_pct: 55.1, ndvi: 0.1740 },
        { year: 2020, built_pct: 60.8, ndvi: 0.1620 },
        { year: 2022, built_pct: 67.4, ndvi: 0.1490 },
        { year: 2024, built_pct: 73.9, ndvi: 0.1350 },
      ],
      water_body: [
        { year: 2016, water_area_km2: 4.82, built_pct: 52.3 },
        { year: 2018, water_area_km2: 4.61, built_pct: 55.1 },
        { year: 2020, water_area_km2: 4.20, built_pct: 60.8 },
        { year: 2022, water_area_km2: 3.74, built_pct: 67.4 },
        { year: 2024, water_area_km2: 3.31, built_pct: 73.9 },
      ],
    },
  },

  {
    slug: "navi-mumbai-airport",
    name: "Navi Mumbai International Airport",
    city: "Navi Mumbai",
    state: "Maharashtra",
    description: "Built over the Ulwe wetlands and mangrove belt — over 1,400 hectares of tidal forest and creeks cleared for runways and the city's second airport. Metrics are illustrative.",
    lat: 18.9900,
    lon: 73.0700,
    zoom: 13,
    bbox: [73.0500, 18.9700, 73.0900, 19.0100],
    featured: true,
    availableThemes: ["urban_growth", "greenery", "water_body", "general"],
    yearRange: [2016, 2024],
    metrics: {
      urban_growth: [
        { year: 2016, built_pct: 18.4, ndvi: 0.4630 },
        { year: 2018, built_pct: 26.7, ndvi: 0.4210 },
        { year: 2020, built_pct: 41.2, ndvi: 0.3580 },
        { year: 2022, built_pct: 57.8, ndvi: 0.2940 },
        { year: 2024, built_pct: 69.3, ndvi: 0.2410 },
      ],
      greenery: [
        { year: 2016, ndvi: 0.4630 },
        { year: 2018, ndvi: 0.4210 },
        { year: 2020, ndvi: 0.3580 },
        { year: 2022, ndvi: 0.2940 },
        { year: 2024, ndvi: 0.2410 },
      ],
      water_body: [
        { year: 2016, water_area_km2: 2.14, built_pct: 18.4 },
        { year: 2018, water_area_km2: 1.87, built_pct: 26.7 },
        { year: 2020, water_area_km2: 1.43, built_pct: 41.2 },
        { year: 2022, water_area_km2: 0.98, built_pct: 57.8 },
        { year: 2024, water_area_km2: 0.62, built_pct: 69.3 },
      ],
    },
  },

  {
    slug: "amaravati-capital",
    name: "Amaravati Capital Region",
    city: "Amaravati",
    state: "Andhra Pradesh",
    description: "Greenfield capital city rising on fertile Krishna delta farmland — grid roads, secretariat buildings, and a high court complex carved out of paddy fields. Metrics are illustrative.",
    lat: 16.5150,
    lon: 80.5180,
    zoom: 12,
    bbox: [80.4780, 16.4750, 80.5580, 16.5550],
    featured: true,
    availableThemes: ["urban_growth", "greenery", "general"],
    yearRange: [2016, 2024],
    metrics: {
      urban_growth: [
        { year: 2016, built_pct: 12.1, ndvi: 0.5340 },
        { year: 2018, built_pct: 21.8, ndvi: 0.4890 },
        { year: 2020, built_pct: 31.4, ndvi: 0.4420 },
        { year: 2022, built_pct: 38.9, ndvi: 0.4110 },
        { year: 2024, built_pct: 44.7, ndvi: 0.3860 },
      ],
      greenery: [
        { year: 2016, ndvi: 0.5340 },
        { year: 2018, ndvi: 0.4890 },
        { year: 2020, ndvi: 0.4420 },
        { year: 2022, ndvi: 0.4110 },
        { year: 2024, ndvi: 0.3860 },
      ],
    },
  },

  {
    slug: "sabarmati-riverfront",
    name: "Sabarmati Riverfront",
    city: "Ahmedabad",
    state: "Gujarat",
    description: "Sabarmati channelized into a constant-level reservoir with promenades, gardens, and a heritage precinct — transforming a seasonal sandy riverbed into a year-round urban waterfront. Metrics are illustrative.",
    lat: 23.0300,
    lon: 72.5800,
    zoom: 14,
    bbox: [72.5600, 23.0100, 72.6000, 23.0500],
    featured: true,
    availableThemes: ["water_body", "urban_growth", "general"],
    yearRange: [2016, 2024],
    metrics: {
      water_body: [
        { year: 2016, water_area_km2: 0.48, built_pct: 44.2 },
        { year: 2018, water_area_km2: 0.71, built_pct: 48.6 },
        { year: 2020, water_area_km2: 0.89, built_pct: 52.1 },
        { year: 2022, water_area_km2: 1.02, built_pct: 55.8 },
        { year: 2024, water_area_km2: 1.14, built_pct: 58.3 },
      ],
      urban_growth: [
        { year: 2016, built_pct: 44.2, ndvi: 0.2310 },
        { year: 2018, built_pct: 48.6, ndvi: 0.2540 },
        { year: 2020, built_pct: 52.1, ndvi: 0.2720 },
        { year: 2022, built_pct: 55.8, ndvi: 0.2890 },
        { year: 2024, built_pct: 58.3, ndvi: 0.3010 },
      ],
    },
  },

  {
    slug: "pallikaranai-marsh",
    name: "Pallikaranai Marshland",
    city: "Chennai",
    state: "Tamil Nadu",
    description: "One of South India's last surviving natural wetlands, steadily shrinking under landfill, garbage dumps, and encroachments — from ~5,000 ha in the 1990s to under 600 ha today. Metrics are illustrative.",
    lat: 12.9400,
    lon: 80.2100,
    zoom: 13,
    bbox: [80.1900, 12.9200, 80.2300, 12.9600],
    featured: true,
    availableThemes: ["water_body", "urban_growth", "greenery", "general"],
    yearRange: [2016, 2024],
    metrics: {
      water_body: [
        { year: 2016, water_area_km2: 1.82, built_pct: 38.4 },
        { year: 2018, water_area_km2: 1.61, built_pct: 42.7 },
        { year: 2020, water_area_km2: 1.44, built_pct: 46.3 },
        { year: 2022, water_area_km2: 1.28, built_pct: 50.1 },
        { year: 2024, water_area_km2: 1.09, built_pct: 54.8 },
      ],
      greenery: [
        { year: 2016, ndvi: 0.3890 },
        { year: 2018, ndvi: 0.3610 },
        { year: 2020, ndvi: 0.3340 },
        { year: 2022, ndvi: 0.3080 },
        { year: 2024, ndvi: 0.2840 },
      ],
      urban_growth: [
        { year: 2016, built_pct: 38.4, ndvi: 0.3890 },
        { year: 2018, built_pct: 42.7, ndvi: 0.3610 },
        { year: 2020, built_pct: 46.3, ndvi: 0.3340 },
        { year: 2022, built_pct: 50.1, ndvi: 0.3080 },
        { year: 2024, built_pct: 54.8, ndvi: 0.2840 },
      ],
    },
  },

  {
    slug: "aravalli-gurugram",
    name: "Aravalli Hills, Gurugram",
    city: "Gurugram",
    state: "Haryana",
    description: "Ancient Aravalli forest fragments razed for luxury residential towers, golf courses, and highways — one of the longest-running battles between ecology and urban sprawl in NCR. Metrics are illustrative.",
    lat: 28.4350,
    lon: 77.0900,
    zoom: 12,
    bbox: [77.0500, 28.3950, 77.1300, 28.4750],
    featured: true,
    availableThemes: ["greenery", "urban_growth", "general"],
    yearRange: [2016, 2024],
    metrics: {
      greenery: [
        { year: 2016, ndvi: 0.4520 },
        { year: 2018, ndvi: 0.4180 },
        { year: 2020, ndvi: 0.3890 },
        { year: 2022, ndvi: 0.3540 },
        { year: 2024, ndvi: 0.3210 },
      ],
      urban_growth: [
        { year: 2016, built_pct: 29.3, ndvi: 0.4520 },
        { year: 2018, built_pct: 35.8, ndvi: 0.4180 },
        { year: 2020, built_pct: 41.2, ndvi: 0.3890 },
        { year: 2022, built_pct: 47.6, ndvi: 0.3540 },
        { year: 2024, built_pct: 53.1, ndvi: 0.3210 },
      ],
    },
  },

  {
    slug: "hyderabad-hitec-city",
    name: "HITEC City & Gachibowli",
    city: "Hyderabad",
    state: "Telangana",
    description: "Barren rocky scrubland west of Hyderabad transformed into India's second-largest IT hub in under two decades — glass towers, ring roads, and campuses replacing the Deccan plateau's open land. Metrics are illustrative.",
    lat: 17.4450,
    lon: 78.3800,
    zoom: 13,
    bbox: [78.3600, 17.4250, 78.4000, 17.4650],
    featured: true,
    availableThemes: ["urban_growth", "greenery", "general"],
    yearRange: [2016, 2024],
    metrics: {
      urban_growth: [
        { year: 2016, built_pct: 58.7, ndvi: 0.2940 },
        { year: 2018, built_pct: 64.3, ndvi: 0.2710 },
        { year: 2020, built_pct: 68.9, ndvi: 0.2520 },
        { year: 2022, built_pct: 73.4, ndvi: 0.2310 },
        { year: 2024, built_pct: 77.8, ndvi: 0.2140 },
      ],
      greenery: [
        { year: 2016, ndvi: 0.2940 },
        { year: 2018, ndvi: 0.2710 },
        { year: 2020, ndvi: 0.2520 },
        { year: 2022, ndvi: 0.2310 },
        { year: 2024, ndvi: 0.2140 },
      ],
    },
  },

  {
    slug: "dholera-smart-city",
    name: "Dholera Smart City",
    city: "Dholera",
    state: "Gujarat",
    description: "India's first greenfield smart city — a grid of activation roads, trunk infrastructure, and industrial zones being laid over the Gulf of Khambhat's tidal salt flats. Metrics are illustrative.",
    lat: 22.2400,
    lon: 72.1800,
    zoom: 12,
    bbox: [72.1400, 22.2000, 72.2200, 22.2800],
    featured: true,
    availableThemes: ["urban_growth", "general"],
    yearRange: [2016, 2024],
    metrics: {
      urban_growth: [
        { year: 2016, built_pct: 3.1, ndvi: 0.1480 },
        { year: 2018, built_pct: 5.8, ndvi: 0.1510 },
        { year: 2020, built_pct: 9.4, ndvi: 0.1560 },
        { year: 2022, built_pct: 14.7, ndvi: 0.1590 },
        { year: 2024, built_pct: 21.3, ndvi: 0.1620 },
      ],
    },
  },

  {
    slug: "polavaram-reservoir",
    name: "Polavaram Dam & Reservoir",
    city: "Polavaram",
    state: "Andhra Pradesh",
    description: "A new reservoir forming behind India's largest ongoing irrigation dam — forests, tribal villages, and river meanders submerging as the Godavari backwaters rise. Metrics are illustrative.",
    lat: 17.2400,
    lon: 81.6500,
    zoom: 12,
    bbox: [81.6100, 17.2000, 81.6900, 17.2800],
    featured: true,
    availableThemes: ["water_body", "urban_growth", "general"],
    yearRange: [2016, 2024],
    metrics: {
      water_body: [
        { year: 2016, water_area_km2: 0.34, built_pct: 22.1 },
        { year: 2018, water_area_km2: 1.12, built_pct: 24.6 },
        { year: 2020, water_area_km2: 3.47, built_pct: 26.8 },
        { year: 2022, water_area_km2: 6.81, built_pct: 28.3 },
        { year: 2024, water_area_km2: 9.24, built_pct: 29.7 },
      ],
      urban_growth: [
        { year: 2016, built_pct: 22.1, ndvi: 0.4820 },
        { year: 2018, built_pct: 24.6, ndvi: 0.4540 },
        { year: 2020, built_pct: 26.8, ndvi: 0.4210 },
        { year: 2022, built_pct: 28.3, ndvi: 0.3870 },
        { year: 2024, built_pct: 29.7, ndvi: 0.3510 },
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
