"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActionButton } from "@/components/action-button";
import type { Appliance, AirConParams } from "@/lib/types/nature";
import {
  AC_MODE_LABELS,
  AC_DIR_LABELS,
  AC_VOL_LABELS,
} from "@/lib/types/nature";
import {
  sendAirconCommand as sendAirconApi,
  sendSignal as sendSignalApi,
} from "@/lib/api-client";
import {
  AirVent,
  Power,
  PowerOff,
  Thermometer,
  Wind,
  ArrowUpDown,
  Snowflake,
  Flame,
  Droplets,
  Fan,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AirconCardProps {
  appliance: Appliance;
  apiKey: string;
  onOperationSuccess?: () => void;
}

const MODE_ICONS: Record<string, React.ReactNode> = {
  auto: <AirVent className="size-4" />,
  cool: <Snowflake className="size-4" />,
  warm: <Flame className="size-4" />,
  dry: <Droplets className="size-4" />,
  blow: <Fan className="size-4" />,
};

const MODE_COLORS: Record<string, string> = {
  auto: "bg-green-500/10 text-green-500 ring-green-500/30",
  cool: "bg-blue-500/10 text-blue-500 ring-blue-500/30",
  warm: "bg-orange-500/10 text-orange-500 ring-orange-500/30",
  dry: "bg-cyan-500/10 text-cyan-500 ring-cyan-500/30",
  blow: "bg-gray-500/10 text-gray-400 ring-gray-500/30",
};

export function AirconCard({
  appliance,
  apiKey,
  onOperationSuccess,
}: AirconCardProps) {
  const aircon = appliance.aircon;
  const settings = appliance.settings;
  const isPowerOn = settings?.button !== "power-off";

  const [mode, setMode] = useState(settings?.mode || "cool");
  const [temp, setTemp] = useState(settings?.temp || "24");
  const [vol, setVol] = useState(settings?.vol || "auto");
  const [dir, setDir] = useState(settings?.dir || "auto");

  const sendAirconCommand = useCallback(
    async (params: AirConParams): Promise<boolean> => {
      try {
        const ok = await sendAirconApi(apiKey, appliance.id, params);
        if (ok) {
          setTimeout(() => onOperationSuccess?.(), 500);
        }
        return ok;
      } catch {
        return false;
      }
    },
    [appliance.id, apiKey, onOperationSuccess]
  );

  const sendSignal = useCallback(
    async (signalId: string): Promise<boolean> => {
      try {
        const ok = await sendSignalApi(apiKey, signalId);
        if (ok) {
          setTimeout(() => onOperationSuccess?.(), 500);
        }
        return ok;
      } catch {
        return false;
      }
    },
    [apiKey, onOperationSuccess]
  );

  const handlePowerOff = useCallback(async () => {
    return sendAirconCommand({ button: "power-off" });
  }, [sendAirconCommand]);

  const handleApplySettings = useCallback(async () => {
    return sendAirconCommand({
      operation_mode: mode,
      temperature: temp,
      air_volume: vol,
      air_direction: dir,
    });
  }, [sendAirconCommand, mode, temp, vol, dir]);

  const currentModeRange = aircon?.range.modes[mode];
  const availableModes = aircon?.range.modes
    ? Object.keys(aircon.range.modes)
    : [];
  const currentModeColor =
    MODE_COLORS[settings?.mode || "auto"] || MODE_COLORS.auto;

  return (
    <Card
      className={cn(
        "bg-card transition-all",
        isPowerOn ? `ring-2 ${currentModeColor.split(" ")[2]}` : "opacity-80"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPowerOn ? (
              MODE_ICONS[settings?.mode || "auto"] || (
                <AirVent className="size-5" />
              )
            ) : (
              <AirVent className="size-5 text-muted-foreground" />
            )}
            <CardTitle className="text-lg">{appliance.nickname}</CardTitle>
          </div>
          <Badge variant="secondary">エアコン</Badge>
        </div>
        {appliance.model && (
          <CardDescription>
            {appliance.model.manufacturer} - {appliance.model.name}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current State - 大きく表示 */}
        <div
          className={cn(
            "rounded-lg p-4 text-center",
            isPowerOn
              ? currentModeColor.split(" ").slice(0, 2).join(" ")
              : "bg-muted text-muted-foreground"
          )}
        >
          {isPowerOn ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div
                  className={cn(
                    "size-3 rounded-full animate-pulse",
                    settings?.mode === "cool"
                      ? "bg-blue-500"
                      : settings?.mode === "warm"
                      ? "bg-orange-500"
                      : settings?.mode === "dry"
                      ? "bg-cyan-500"
                      : settings?.mode === "blow"
                      ? "bg-gray-400"
                      : "bg-green-500"
                  )}
                />
                <span className="text-lg font-semibold">
                  {AC_MODE_LABELS[settings?.mode || ""] || settings?.mode}
                </span>
              </div>
              <div className="text-3xl font-bold">
                {settings?.temp}°{settings?.temp_unit?.toUpperCase()}
              </div>
              <div className="flex justify-center gap-4 mt-2 text-sm opacity-80">
                <span>
                  風量: {AC_VOL_LABELS[settings?.vol || ""] || settings?.vol}
                </span>
                <span>
                  風向: {AC_DIR_LABELS[settings?.dir || ""] || settings?.dir}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2">
                <div className="size-3 rounded-full bg-muted-foreground" />
                <span className="text-lg font-semibold">電源OFF</span>
              </div>
            </>
          )}
        </div>

        {/* Power Control */}
        <div className="flex gap-2">
          <ActionButton
            onClick={handleApplySettings}
            variant="default"
            size="sm"
            className="flex-1"
          >
            <Power className="size-4" />
            <span>{isPowerOn ? "設定を適用" : "電源ON"}</span>
          </ActionButton>
          <ActionButton
            onClick={handlePowerOff}
            variant="outline"
            size="sm"
            disabled={!isPowerOn}
          >
            <PowerOff className="size-4" />
            <span>OFF</span>
          </ActionButton>
        </div>

        <Separator />

        {/* Settings Controls */}
        <div
          className={cn(
            "grid gap-4 sm:grid-cols-2 transition-opacity",
            !isPowerOn && "opacity-50"
          )}
        >
          {/* Mode Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Wind className="size-4" />
              運転モード
            </label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableModes.map((m) => (
                  <SelectItem key={m} value={m}>
                    <span className="flex items-center gap-2">
                      {MODE_ICONS[m]}
                      {AC_MODE_LABELS[m] || m}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Temperature Selection */}
          {currentModeRange?.temp &&
            currentModeRange.temp.length > 0 &&
            currentModeRange.temp[0] !== "" && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Thermometer className="size-4" />
                  温度
                </label>
                <Select value={temp} onValueChange={setTemp}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currentModeRange.temp.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}°{aircon?.tempUnit?.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

          {/* Air Volume Selection */}
          {currentModeRange?.vol &&
            currentModeRange.vol.length > 0 &&
            currentModeRange.vol[0] !== "" && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Wind className="size-4" />
                  風量
                </label>
                <Select value={vol} onValueChange={setVol}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currentModeRange.vol.map((v) => (
                      <SelectItem key={v} value={v}>
                        {AC_VOL_LABELS[v] || v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

          {/* Air Direction Selection */}
          {currentModeRange?.dir &&
            currentModeRange.dir.length > 0 &&
            currentModeRange.dir[0] !== "" && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ArrowUpDown className="size-4" />
                  風向
                </label>
                <Select value={dir} onValueChange={setDir}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currentModeRange.dir.map((d) => (
                      <SelectItem key={d} value={d}>
                        {AC_DIR_LABELS[d] || d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
        </div>

        {/* Custom Signals */}
        {appliance.signals && appliance.signals.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2">カスタムボタン</h4>
              <div className="flex flex-wrap gap-2">
                {appliance.signals.map((signal) => (
                  <ActionButton
                    key={signal.id}
                    onClick={() => sendSignal(signal.id)}
                    variant="outline"
                    size="sm"
                  >
                    <span>{signal.name}</span>
                  </ActionButton>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Device Info */}
        <Separator />
        <div className="text-xs text-muted-foreground space-y-1">
          <p>デバイス: {appliance.device.name}</p>
          <p>シリアル: {appliance.device.serial_number}</p>
          {settings?.updated_at && (
            <p>
              最終更新: {new Date(settings.updated_at).toLocaleString("ja-JP")}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
