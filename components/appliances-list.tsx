"use client";

import { useEffect, useState, useCallback } from "react";
import type { Appliance } from "@/lib/types/nature";
import {
  LightCard,
  AirconCard,
  TVCard,
  IRCard,
  AppliancesLoadingSkeleton,
} from "@/components/appliances";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { useApiKey } from "@/lib/api-key-context";

interface AppliancesListProps {
  onRefresh?: () => void;
}

export function AppliancesList({ onRefresh }: AppliancesListProps) {
  const { apiKey } = useApiKey();
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppliances = useCallback(
    async (isRefresh = false) => {
      if (!apiKey) return;

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await fetch("/api/appliances", {
          headers: {
            "X-Nature-Api-Key": apiKey,
          },
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch appliances");
        }
        const data: Appliance[] = await response.json();
        setAppliances(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [apiKey]
  );

  useEffect(() => {
    if (apiKey) {
      fetchAppliances();
    }
  }, [apiKey, fetchAppliances]);

  const handleRefresh = () => {
    fetchAppliances(true);
    onRefresh?.();
  };

  const renderApplianceCard = (appliance: Appliance) => {
    switch (appliance.type) {
      case "LIGHT":
        return (
          <LightCard
            key={appliance.id}
            appliance={appliance}
            apiKey={apiKey!}
          />
        );
      case "AC":
        return (
          <AirconCard
            key={appliance.id}
            appliance={appliance}
            apiKey={apiKey!}
          />
        );
      case "TV":
        return (
          <TVCard key={appliance.id} appliance={appliance} apiKey={apiKey!} />
        );
      default:
        return (
          <IRCard key={appliance.id} appliance={appliance} apiKey={apiKey!} />
        );
    }
  };

  if (loading) {
    return <AppliancesLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="size-12 text-destructive mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-2">
          エラーが発生しました
        </h2>
        <p className="text-muted-foreground mb-4 max-w-md">{error}</p>
        <Button onClick={() => fetchAppliances()} variant="outline">
          <RefreshCw className="size-4 mr-2" />
          再試行
        </Button>
      </div>
    );
  }

  if (appliances.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-4">
          登録されている家電がありません
        </p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="size-4 mr-2" />
          更新
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={refreshing}
        >
          <RefreshCw
            className={`size-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          更新
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {appliances.map(renderApplianceCard)}
      </div>
    </div>
  );
}
