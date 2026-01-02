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
import type { Appliance, TV } from "@/lib/types/nature";
import {
  Tv,
  Power,
  Volume2,
  VolumeOff,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Home,
  ArrowLeft,
  Menu,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TVCardProps {
  appliance: Appliance;
  apiKey: string;
}

const TV_ICON_MAP: Record<string, React.ReactNode> = {
  ico_io: <Power className="size-4" />,
  ico_on: <Power className="size-4" />,
  ico_off: <Power className="size-4" />,
  ico_vol_up: <Volume2 className="size-4" />,
  ico_vol_down: <Volume2 className="size-4" />,
  ico_mute: <VolumeOff className="size-4" />,
  ico_ch_up: <ChevronUp className="size-4" />,
  ico_ch_down: <ChevronDown className="size-4" />,
  ico_arrow_top: <ChevronUp className="size-4" />,
  ico_arrow_bottom: <ChevronDown className="size-4" />,
  ico_arrow_left: <ChevronLeft className="size-4" />,
  ico_arrow_right: <ChevronRight className="size-4" />,
  ico_play: <Play className="size-4" />,
  ico_pause: <Pause className="size-4" />,
  ico_prev: <SkipBack className="size-4" />,
  ico_next: <SkipForward className="size-4" />,
  ico_home: <Home className="size-4" />,
  ico_back: <ArrowLeft className="size-4" />,
  ico_menu: <Menu className="size-4" />,
  ico_select: <Circle className="size-4" />,
};

export function TVCard({ appliance, apiKey }: TVCardProps) {
  const tv: TV | null = appliance.tv;

  const sendTVCommand = useCallback(
    async (button: string): Promise<boolean> => {
      try {
        const response = await fetch(`/api/appliances/${appliance.id}/tv`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Nature-Api-Key": apiKey,
          },
          body: JSON.stringify({ button }),
        });
        return response.ok;
      } catch {
        return false;
      }
    },
    [appliance.id, apiKey]
  );

  const sendSignal = useCallback(
    async (signalId: string): Promise<boolean> => {
      try {
        const response = await fetch(`/api/signals/${signalId}/send`, {
          method: "POST",
          headers: {
            "X-Nature-Api-Key": apiKey,
          },
        });
        return response.ok;
      } catch {
        return false;
      }
    },
    [apiKey]
  );

  return (
    <Card className={cn("bg-card transition-all")}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tv className="size-5 text-purple-500" />
            <CardTitle className="text-lg">{appliance.nickname}</CardTitle>
          </div>
          <Badge variant="secondary">TV</Badge>
        </div>
        {appliance.model && (
          <CardDescription>
            {appliance.model.manufacturer} - {appliance.model.name}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current State */}
        {tv?.state && tv.state.input && (
          <div className="rounded-lg bg-purple-500/10 p-3 text-center">
            <p className="text-sm text-muted-foreground">入力</p>
            <p className="font-semibold text-purple-400">{tv.state.input}</p>
          </div>
        )}

        {/* TV Buttons */}
        {tv?.buttons && tv.buttons.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">コントロール</h4>
            <div className="flex flex-wrap gap-2">
              {tv.buttons.map((button) => (
                <ActionButton
                  key={button.name}
                  onClick={() => sendTVCommand(button.name)}
                  variant={button.name === "power" ? "default" : "outline"}
                  size="sm"
                >
                  {TV_ICON_MAP[button.image] || null}
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
                    {TV_ICON_MAP[signal.image] || null}
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
