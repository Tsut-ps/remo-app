"use client";

import { API_ENDPOINTS, getAuthHeaders } from "@/lib/config";
import type { Appliance, AirConParams } from "@/lib/types/nature";

// https://developer.nature.global/ 参照

export async function fetchAppliances(apiKey: string): Promise<Appliance[]> {
  const response = await fetch(API_ENDPOINTS.appliances, {
    headers: getAuthHeaders(apiKey),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`APIエラー: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export async function sendLightCommand(
  apiKey: string,
  applianceId: string,
  button: string
): Promise<boolean> {
  const response = await fetch(API_ENDPOINTS.light(applianceId), {
    method: "POST",
    headers: {
      ...getAuthHeaders(apiKey),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ button }),
  });

  return response.ok;
}

export async function sendAirconCommand(
  apiKey: string,
  applianceId: string,
  params: AirConParams
): Promise<boolean> {
  const formParams = new URLSearchParams();

  if (params.temperature !== undefined)
    formParams.append("temperature", params.temperature);
  if (params.temperature_unit !== undefined)
    formParams.append("temperature_unit", params.temperature_unit);
  if (params.operation_mode !== undefined)
    formParams.append("operation_mode", params.operation_mode);
  if (params.air_volume !== undefined)
    formParams.append("air_volume", params.air_volume);
  if (params.air_direction !== undefined)
    formParams.append("air_direction", params.air_direction);
  if (params.air_direction_h !== undefined)
    formParams.append("air_direction_h", params.air_direction_h);
  if (params.button !== undefined) formParams.append("button", params.button);

  const response = await fetch(API_ENDPOINTS.aircon(applianceId), {
    method: "POST",
    headers: {
      ...getAuthHeaders(apiKey),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formParams,
  });

  return response.ok;
}

export async function sendTVCommand(
  apiKey: string,
  applianceId: string,
  button: string
): Promise<boolean> {
  const response = await fetch(API_ENDPOINTS.tv(applianceId), {
    method: "POST",
    headers: {
      ...getAuthHeaders(apiKey),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ button }),
  });

  return response.ok;
}

export async function sendSignal(
  apiKey: string,
  signalId: string
): Promise<boolean> {
  const response = await fetch(API_ENDPOINTS.signal(signalId), {
    method: "POST",
    headers: {
      ...getAuthHeaders(apiKey),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "",
  });

  return response.ok;
}
