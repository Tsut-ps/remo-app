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
  Lightbulb,
  Power,
  PowerOff,
  Sun,
  Moon,
  Star,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface LightCardProps {
  appliance: Appliance;
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

export function LightCard({ appliance }: LightCardProps) {
  const light: Light | null = appliance.light;

  const sendLightCommand = useCallback(
    async (button: string): Promise<boolean> => {
      try {
        const response = await fetch(`/api/appliances/${appliance.id}/light`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ button }),
        });
        return response.ok;
      } catch {
        return false;
      }
    },
    [appliance.id]
  );

  const sendSignal = useCallback(async (signalId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/signals/${signalId}/send`, {
        method: "POST",
      });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  return (
    <Card className="bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-5 text-yellow-500" />
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
        {/* Current State */}
        {light?.state && (
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span>状態:</span>
            <Badge variant={light.state.power === "on" ? "default" : "outline"}>
              {light.state.power === "on" ? "オン" : "オフ"}
            </Badge>
            {light.state.brightness && (
              <Badge variant="outline">{light.state.brightness}</Badge>
            )}
          </div>
        )}

        {/* Light Buttons */}
        {light?.buttons && light.buttons.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">コントロール</h4>
            <div className="flex flex-wrap gap-2">
              {light.buttons.map((button) => (
                <ActionButton
                  key={button.name}
                  onClick={() => sendLightCommand(button.name)}
                  variant="outline"
                  size="sm"
                >
                  {ICON_MAP[button.image] || null}
                  <span>{button.label}</span>
                </ActionButton>
              ))}
            </div>
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
          <p>ファームウェア: {appliance.device.firmware_version}</p>
        </div>
      </CardContent>
    </Card>
  );
}
