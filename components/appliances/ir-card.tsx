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
import type { Appliance } from "@/lib/types/nature";
import { Radio } from "lucide-react";

interface IRCardProps {
  appliance: Appliance;
}

export function IRCard({ appliance }: IRCardProps) {
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
            <Radio className="size-5 text-orange-500" />
            <CardTitle className="text-lg">{appliance.nickname}</CardTitle>
          </div>
          <Badge variant="secondary">IR</Badge>
        </div>
        {appliance.model && (
          <CardDescription>
            {appliance.model.manufacturer} - {appliance.model.name}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Custom Signals */}
        {appliance.signals && appliance.signals.length > 0 ? (
          <div>
            <h4 className="text-sm font-medium mb-2">登録済みボタン</h4>
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
        ) : (
          <p className="text-sm text-muted-foreground">
            登録されているボタンがありません
          </p>
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
