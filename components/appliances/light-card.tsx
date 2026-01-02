"use client";

import { useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ActionButton } from "@/components/action-button";
import type { Appliance, Light } from "@/lib/types/nature";
import {
  sendLightCommand as sendLightApi,
  sendSignal as sendSignalApi,
} from "@/lib/api-client";
import {
  Lightbulb,
  LightbulbOff,
  Power,
  PowerOff,
  Sun,
  Moon,
  Star,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LightCardProps {
  appliance: Appliance;
  apiKey: string;
  onOperationSuccess?: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  ico_on: <Power className="size-4" />,
  ico_off: <PowerOff className="size-4" />,
  ico_light_all: <Sun className="size-4" />,
  ico_light_favorite: <Star className="size-4" />,
  ico_light_night: <Moon className="size-4" />,
  ico_arrow_top: <ChevronUp className="size-4" />,
  ico_arrow_bottom: <ChevronDown className="size-4" />,
  ico_lightup: <ChevronUp className="size-4" />,
  ico_lightdown: <ChevronDown className="size-4" />,
};

// OFFの時に使えないボタン
const REQUIRES_POWER_ON = [
  "on-100",
  "on-favorite",
  "night",
  "bright-up",
  "bright-down",
];

export function LightCard({
  appliance,
  apiKey,
  onOperationSuccess,
}: LightCardProps) {
  const light: Light | null = appliance.light;
  const isPowerOn = light?.state?.power === "on";

  const sendLightCommand = useCallback(
    async (button: string): Promise<boolean> => {
      try {
        const ok = await sendLightApi(apiKey, appliance.id, button);
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

  const isButtonDisabled = (buttonName: string): boolean => {
    // 電源がOFFの時、一部のボタンは使えない
    if (!isPowerOn && REQUIRES_POWER_ON.includes(buttonName)) {
      return true;
    }
    return false;
  };

  return (
    <Card
      className={cn(
        "bg-card transition-all",
        isPowerOn ? "ring-2 ring-yellow-500/30" : "opacity-80"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPowerOn ? (
              <Lightbulb className="size-5 text-yellow-500" />
            ) : (
              <LightbulbOff className="size-5 text-muted-foreground" />
            )}
            <CardTitle className="text-lg">{appliance.nickname}</CardTitle>
          </div>
          <Badge variant="secondary">照明</Badge>
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
            isPowerOn ? "bg-yellow-500/10" : "bg-muted"
          )}
        >
          <div className="flex items-center justify-center gap-3">
            {isPowerOn ? (
              <>
                <div className="size-3 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-lg font-semibold text-yellow-500">
                  電源ON
                </span>
              </>
            ) : (
              <>
                <div className="size-3 rounded-full bg-muted-foreground" />
                <span className="text-lg font-semibold text-muted-foreground">
                  電源OFF
                </span>
              </>
            )}
          </div>
          {light?.state?.brightness && isPowerOn && (
            <p className="text-sm text-muted-foreground mt-1">
              明るさ: {light.state.brightness}
            </p>
          )}
          {light?.state?.last_button && (
            <p className="text-xs text-muted-foreground mt-1">
              最後の操作: {light.state.last_button}
            </p>
          )}
        </div>

        {/* Light Buttons */}
        {light?.buttons && light.buttons.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">コントロール</h4>
            <div className="flex flex-wrap gap-2">
              {light.buttons.map((button) => {
                const disabled = isButtonDisabled(button.name);
                return (
                  <ActionButton
                    key={button.name}
                    onClick={() => sendLightCommand(button.name)}
                    variant={button.name === "on" ? "default" : "outline"}
                    size="sm"
                    disabled={disabled}
                  >
                    {ICON_MAP[button.image] || null}
                    <span>{button.label}</span>
                  </ActionButton>
                );
              })}
            </div>
            {!isPowerOn && (
              <p className="text-xs text-muted-foreground mt-2">
                ※ 一部のボタンは電源ONの状態でのみ使用可能です
              </p>
            )}
          </div>
        )}

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
                    {ICON_MAP[signal.image] || null}
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
        </div>
      </CardContent>
    </Card>
  );
}
