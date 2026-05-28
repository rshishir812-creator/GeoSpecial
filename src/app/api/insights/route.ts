import { NextRequest, NextResponse } from "next/server";
import { generateInsight, parsePromptToQuery, InsightContext } from "@/lib/groq";
import { geocodeAddress } from "@/lib/geocode";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.prompt) {
      // Paid flow: parse free-text prompt
      const parsed = await parsePromptToQuery(body.prompt);
      if (!parsed) {
        return NextResponse.json({ error: "Could not parse location from prompt" }, { status: 422 });
      }
      const geo = await geocodeAddress(parsed.locationName + " India");
      const ctx: InsightContext = {
        ...parsed,
        fromYear: parsed.fromYear,
        toYear: parsed.toYear,
      };
      const insight = await generateInsight(ctx);
      return NextResponse.json({ insight, parsed, geo });
    }

    // Free flow: structured context
    const ctx: InsightContext = body as InsightContext;
    if (!ctx.locationName || !ctx.fromYear || !ctx.toYear) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const insight = await generateInsight(ctx);
    return NextResponse.json({ insight });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
