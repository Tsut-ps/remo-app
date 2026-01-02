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
    const {
      temperature,
      temperature_unit,
      operation_mode,
      air_volume,
      air_direction,
      air_direction_h,
      button,
    } = body;

    const formParams = new URLSearchParams();

    if (temperature !== undefined)
      formParams.append("temperature", temperature);
    if (temperature_unit !== undefined)
      formParams.append("temperature_unit", temperature_unit);
    if (operation_mode !== undefined)
      formParams.append("operation_mode", operation_mode);
    if (air_volume !== undefined) formParams.append("air_volume", air_volume);
    if (air_direction !== undefined)
      formParams.append("air_direction", air_direction);
    if (air_direction_h !== undefined)
      formParams.append("air_direction_h", air_direction_h);
    if (button !== undefined) formParams.append("button", button);

    const response = await fetch(API_ENDPOINTS.aircon(id), {
      method: "POST",
      headers: {
        ...getAuthHeaders(apiKey),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formParams,
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
    console.error("Failed to control aircon:", error);
    return NextResponse.json(
      { error: "Failed to control aircon" },
      { status: 500 }
    );
  }
}
