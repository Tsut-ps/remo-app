// Nature Remo API Type Definitions

export interface Device {
  name: string;
  id: string;
  created_at: string;
  updated_at: string;
  mac_address: string;
  serial_number: string;
  firmware_version: string;
  temperature_offset: number;
  humidity_offset: number;
}

export interface ApplianceModel {
  id: string;
  country: string;
  manufacturer: string;
  remote_name: string;
  series?: string;
  name: string;
  image: string;
}

export interface Signal {
  id: string;
  name: string;
  image: string;
}

export interface LightButton {
  name: string;
  image: string;
  label: string;
}

export interface LightState {
  brightness: string;
  power: string;
  last_button: string;
}

export interface Light {
  buttons: LightButton[];
  state: LightState | null;
}

export interface AirconModeRange {
  temp: string[];
  dir: string[];
  dirh: string[];
  vol: string[];
}

export interface AirconRange {
  modes: {
    [key: string]: AirconModeRange;
  };
  fixedButtons: string[];
}

export interface Aircon {
  range: AirconRange;
  tempUnit: string;
}

export interface AirconSettings {
  temp: string;
  temp_unit: string;
  mode: string;
  vol: string;
  dir: string;
  dirh: string;
  button: string;
  updated_at: string;
}

export interface TVButton {
  name: string;
  image: string;
  label: string;
}

export interface TVState {
  input: string;
}

export interface TV {
  buttons: TVButton[];
  state: TVState | null;
}

export type ApplianceType = "AC" | "LIGHT" | "TV" | "IR";

export interface Appliance {
  id: string;
  type: ApplianceType;
  nickname: string;
  image: string;
  device: Device;
  model: ApplianceModel | null;
  settings: AirconSettings | null;
  aircon: Aircon | null;
  signals: Signal[];
  light: Light | null;
  tv: TV | null;
}

// API Request/Response types
export interface LightParams {
  button: string;
}

export interface AirConParams {
  temperature?: string;
  temperature_unit?: string;
  operation_mode?: string;
  air_volume?: string;
  air_direction?: string;
  air_direction_h?: string;
  button?: string;
}

export interface TVParams {
  button: string;
}

// Action result types
export interface ActionResult {
  success: boolean;
  error?: string;
}

// Mode labels for display
export const AC_MODE_LABELS: Record<string, string> = {
  auto: "自動",
  cool: "冷房",
  warm: "暖房",
  dry: "除湿",
  blow: "送風",
};

export const AC_DIR_LABELS: Record<string, string> = {
  still: "固定",
  swing: "スイング",
  "": "自動",
};

export const AC_VOL_LABELS: Record<string, string> = {
  auto: "自動",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "": "自動",
};
