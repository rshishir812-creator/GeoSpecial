import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const location = searchParams.get("location") ?? "Unknown Location";
  const from = searchParams.get("from") ?? "2015";
  const to = searchParams.get("to") ?? "2024";
  const theme = searchParams.get("theme") ?? "general";

  const themeLabel: Record<string, string> = {
    urban_growth: "Urban Growth",
    greenery: "Greenery Loss",
    water_body: "Water Bodies",
    general: "Transformation",
  };

  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0f"/>
      <stop offset="100%" style="stop-color:#0f1a2e"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00d2ff"/>
      <stop offset="100%" style="stop-color:#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="580" width="1200" height="4" fill="url(#accent)"/>
  <text x="60" y="80" font-family="system-ui,-apple-system,sans-serif" font-size="22" fill="#4ade80" letter-spacing="4">GEO SPECIAL</text>
  <text x="60" y="200" font-family="system-ui,-apple-system,sans-serif" font-size="72" font-weight="700" fill="#ffffff">${location}</text>
  <text x="60" y="290" font-family="system-ui,-apple-system,sans-serif" font-size="36" fill="#94a3b8">${themeLabel[theme] ?? theme}</text>
  <rect x="60" y="340" width="200" height="3" fill="url(#accent)"/>
  <text x="60" y="420" font-family="system-ui,-apple-system,sans-serif" font-size="52" font-weight="600" fill="#00d2ff">${from}</text>
  <text x="200" y="420" font-family="system-ui,-apple-system,sans-serif" font-size="40" fill="#475569">→</text>
  <text x="280" y="420" font-family="system-ui,-apple-system,sans-serif" font-size="52" font-weight="600" fill="#7c3aed">${to}</text>
  <text x="60" y="540" font-family="system-ui,-apple-system,sans-serif" font-size="24" fill="#64748b">geospecial.app · Satellite Intelligence</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
