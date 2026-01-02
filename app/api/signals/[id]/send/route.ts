import { NextRequest, NextResponse } from "next/server";

const NATURE_API_BASE = "https://api.nature.global/1";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const clientApiKey = request.headers.get("X-Nature-Api-Key");
  const apiKey = clientApiKey || process.env.NATURE_API_KEY;
  const { id } = await params;

  if (!apiKey) {
    return NextResponse.json(
      { error: "APIキーが設定されていません" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${NATURE_API_BASE}/signals/${id}/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
