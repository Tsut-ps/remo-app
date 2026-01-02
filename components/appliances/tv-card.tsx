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

interface TVCardProps {
  appliance: Appliance;
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

export function TVCard({ appliance }: TVCardProps) {
  const tv: TV | null = appliance.tv;

  const sendTVCommand = useCallback(
    async (button: string): Promise<boolean> => {
      try {
        const response = await fetch(`/api/appliances/${appliance.id}/tv`, {
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
        {tv?.state && (
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span>入力:</span>
            <Badge variant="outline">{tv.state.input || "不明"}</Badge>
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
                  variant="outline"
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
          <p>ファームウェア: {appliance.device.firmware_version}</p>
        </div>
      </CardContent>
    </Card>
  );
}
