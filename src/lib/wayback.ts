export interface WaybackRelease {
  id: number;
  label: string;
  date: string;
  tileUrl: string;
}

const CONFIG_URL =
  "https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/waybackconfig.json";

let _cachedReleases: WaybackRelease[] | null = null;

export async function fetchWaybackReleases(): Promise<WaybackRelease[]> {
  if (_cachedReleases) return _cachedReleases;

  const res = await fetch(CONFIG_URL);
  if (!res.ok) throw new Error(`Wayback config fetch failed: ${res.status}`);
  const data: Record<string, { itemTitle: string; itemURL: string; layerIdentifier: string }> =
    await res.json();

  const releases: WaybackRelease[] = Object.entries(data).map(([idStr, info]) => {
    const id = Number(idStr);
    // itemTitle: "World Imagery (Wayback 2024-11-20)"
    const match = info.itemTitle.match(/(\d{4}-\d{2}-\d{2})/);
    const date = match ? match[1] : idStr;
    // itemURL uses {level}/{row}/{col} — remap to MapLibre {z}/{y}/{x}
    const tileUrl = info.itemURL
      .replace("{level}", "{z}")
      .replace("{row}", "{y}")
      .replace("{col}", "{x}");
    return { id, label: info.itemTitle, date, tileUrl };
  });

  _cachedReleases = releases.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return _cachedReleases;
}

export function waybackTileUrl(releaseId: number): string {
  return `https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/${releaseId}/{z}/{y}/{x}`;
}
