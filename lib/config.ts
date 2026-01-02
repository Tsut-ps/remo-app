// Nature Remo API Configuration
export const NATURE_API_BASE = "https://api.nature.global/1";

// API Endpoints
export const API_ENDPOINTS = {
  appliances: `${NATURE_API_BASE}/appliances`,
  light: (applianceId: string) =>
    `${NATURE_API_BASE}/appliances/${applianceId}/light`,
  aircon: (applianceId: string) =>
    `${NATURE_API_BASE}/appliances/${applianceId}/aircon_settings`,
  tv: (applianceId: string) =>
    `${NATURE_API_BASE}/appliances/${applianceId}/tv`,
  signal: (signalId: string) => `${NATURE_API_BASE}/signals/${signalId}/send`,
} as const;

// LocalStorage Keys
export const STORAGE_KEYS = {
  apiKey: "nature-remo-api-key",
} as const;

// Request Headers
export const getAuthHeaders = (apiKey: string) => ({
  Authorization: `Bearer ${apiKey}`,
});
