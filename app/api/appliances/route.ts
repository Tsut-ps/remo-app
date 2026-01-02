import { NextRequest, NextResponse } from "next/server";
import type { Appliance } from "@/lib/types/nature";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/config";

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("X-Nature-Api-Key");

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "APIキーが設定されていません。設定画面からAPIキーを入力してください。",
      },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(API_ENDPOINTS.appliances, {
      headers: getAuthHeaders(apiKey),
      cache: "no-store",
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
