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
    const response = await fetch(API_ENDPOINTS.signal(id), {
      method: "POST",
      headers: {
        ...getAuthHeaders(apiKey),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Nature API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send signal:", error);
    return NextResponse.json(
      { error: "Failed to send signal" },
      { status: 500 }
    );
  }
}
