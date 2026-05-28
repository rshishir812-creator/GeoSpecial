export interface GeocodeResult {
  display_name: string;
  lat: number;
  lon: number;
}

export async function geocodeAddress(query: string): Promise<GeocodeResult | null> {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "GeoSpecial/1.0 (contact@geospecial.app)" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const feature = data.features?.[0];
  if (!feature) return null;
  const [lon, lat] = feature.geometry.coordinates;
  const props = feature.properties;
  const display_name = [props.name, props.city, props.country]
    .filter(Boolean)
    .join(", ");
  return { display_name, lat, lon };
}
