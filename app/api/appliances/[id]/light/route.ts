import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/config";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = request.headers.get("X-Nature-Api-Key");
  const { id } = await params;

  if (!apiKey) {
    return NextResponse.json(
      { error: "APIキーが設定されていません" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { button } = body;

    if (!button) {
      return NextResponse.json(
        { error: "Button parameter is required" },
        { status: 400 }
      );
    }

    const response = await fetch(API_ENDPOINTS.light(id), {
      method: "POST",
      headers: {
        ...getAuthHeaders(apiKey),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ button }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Nature API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to control light:", error);
    return NextResponse.json(
      { error: "Failed to control light" },
      { status: 500 }
    );
  }
}
