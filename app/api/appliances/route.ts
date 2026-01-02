import { NextResponse } from "next/server";
import type { Appliance } from "@/lib/types/nature";

const NATURE_API_BASE = "https://api.nature.global/1";

export async function GET() {
  const apiKey = process.env.NATURE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "NATURE_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${NATURE_API_BASE}/appliances`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      // Revalidate every 30 seconds
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Nature API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const appliances: Appliance[] = await response.json();
    return NextResponse.json(appliances);
  } catch (error) {
    console.error("Failed to fetch appliances:", error);
    return NextResponse.json(
      { error: "Failed to fetch appliances" },
      { status: 500 }
    );
  }
}
