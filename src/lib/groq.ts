import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY ?? "",
});

export interface InsightContext {
  locationName: string;
  fromYear: number;
  toYear: number;
  theme: string;
  ndvi_change?: number;
  water_area_change?: number;
  built_change?: number;
}

export async function generateInsight(ctx: InsightContext): Promise<string> {
  const metricsText = [
    ctx.ndvi_change !== undefined
      ? `Vegetation index changed by ${ctx.ndvi_change > 0 ? "+" : ""}${(ctx.ndvi_change * 100).toFixed(1)}%`
      : null,
    ctx.water_area_change !== undefined
      ? `Water body area changed by ${ctx.water_area_change > 0 ? "+" : ""}${ctx.water_area_change.toFixed(1)} km²`
      : null,
    ctx.built_change !== undefined
      ? `Built-up area expanded by ${ctx.built_change.toFixed(1)}%`
      : null,
  ]
    .filter(Boolean)
    .join(". ");

  const prompt = `You are a geospatial storytelling AI for an India-focused satellite change-detection app called Geo Special.

Location: ${ctx.locationName}
Time period: ${ctx.fromYear} → ${ctx.toYear}
Theme: ${ctx.theme}
${metricsText ? `Data: ${metricsText}` : "Only visual satellite imagery is available."}

Write a 3–4 sentence emotionally resonant insight about how this place changed. Evoke curiosity, nostalgia, or environmental awareness. Be specific to India where possible. End with one provocative question for the reader. Do not use bullet points.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content ?? "";
}

export async function parsePromptToQuery(prompt: string): Promise<{
  locationName: string;
  fromYear: number;
  toYear: number;
  theme: string;
} | null> {
  const systemPrompt = `You are a query parser for a geospatial app. Extract structured data from user prompts about location change over time.
Return ONLY valid JSON with these fields:
- locationName: string (specific area/city in India)
- fromYear: number (4-digit year, min 2014)
- toYear: number (4-digit year, max current year)
- theme: one of "urban_growth" | "greenery" | "water_body" | "general"

If you cannot extract a clear location, return null.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    max_tokens: 100,
    temperature: 0,
    response_format: { type: "json_object" },
  });

  try {
    const text = completion.choices[0]?.message?.content ?? "null";
    const parsed = JSON.parse(text);
    if (!parsed?.locationName) return null;
    return parsed;
  } catch {
    return null;
  }
}
