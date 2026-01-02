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
  AirVent,
  Power,
  PowerOff,
  Thermometer,
  Wind,
  ArrowUpDown,
} from "lucide-react";

interface AirconCardProps {
  appliance: Appliance;
}

export function AirconCard({ appliance }: AirconCardProps) {
  const aircon = appliance.aircon;
  const settings = appliance.settings;

  const [mode, setMode] = useState(settings?.mode || "cool");
  const [temp, setTemp] = useState(settings?.temp || "24");
  const [vol, setVol] = useState(settings?.vol || "auto");
  const [dir, setDir] = useState(settings?.dir || "auto");

  const sendAirconCommand = useCallback(
    async (params: AirConParams): Promise<boolean> => {
      try {
        const response = await fetch(`/api/appliances/${appliance.id}/aircon`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });
        return response.ok;
      } catch {
        return false;
      }
    },
    [appliance.id]
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

  return (
    <Card className="bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AirVent className="size-5 text-blue-500" />
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
        {/* Current Settings Display */}
        {settings && (
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge
              variant={settings.button !== "power-off" ? "default" : "outline"}
            >
              {settings.button === "power-off" ? "オフ" : "オン"}
            </Badge>
            <Badge variant="outline">
              {AC_MODE_LABELS[settings.mode] || settings.mode}
            </Badge>
            <Badge variant="outline">
              {settings.temp}°{settings.temp_unit.toUpperCase()}
            </Badge>
            <Badge variant="outline">
              風量: {AC_VOL_LABELS[settings.vol] || settings.vol}
            </Badge>
          </div>
        )}

        {/* Power Control */}
        <div className="flex gap-2">
          <ActionButton
            onClick={handleApplySettings}
            variant="default"
            size="sm"
          >
            <Power className="size-4" />
            <span>電源オン / 設定適用</span>
          </ActionButton>
          <ActionButton onClick={handlePowerOff} variant="outline" size="sm">
            <PowerOff className="size-4" />
            <span>電源オフ</span>
          </ActionButton>
        </div>

        <Separator />

        {/* Settings Controls */}
        <div className="grid gap-4 sm:grid-cols-2">
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
                    {AC_MODE_LABELS[m] || m}
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
                        {t}°{aircon?.tempUnit.toUpperCase()}
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
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `/api/signals/${signal.id}/send`,
                          { method: "POST" }
                        );
                        return res.ok;
                      } catch {
                        return false;
                      }
                    }}
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
          <p>ファームウェア: {appliance.device.firmware_version}</p>
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
