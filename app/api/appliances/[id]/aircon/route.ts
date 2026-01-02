import { NextRequest, NextResponse } from "next/server";

const NATURE_API_BASE = "https://api.nature.global/1";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = process.env.NATURE_API_KEY;
  const { id } = await params;

  if (!apiKey) {
    return NextResponse.json(
      { error: "NATURE_API_KEY is not configured" },
      { status: 500 }
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

    const response = await fetch(
      `${NATURE_API_BASE}/appliances/${id}/aircon_settings`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formParams,
      }
    );

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
