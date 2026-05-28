import { NextResponse } from "next/server";
import { fetchWaybackReleases } from "@/lib/wayback";

export const runtime = "edge";

export async function GET() {
  try {
    const releases = await fetchWaybackReleases();
    return NextResponse.json({ releases });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
