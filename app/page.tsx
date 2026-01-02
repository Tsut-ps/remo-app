"use client";

import { useState, useCallback } from "react";
import { AppliancesList } from "@/components/appliances-list";
import { AppliancesLoadingSkeleton } from "@/components/appliances";
import { useApiKey, useHydrated } from "@/lib/store";
import { ApiKeyDialog } from "@/components/api-key-dialog";
import { Button } from "@/components/ui/button";
import { Settings, Key } from "lucide-react";

export default function Home() {
  const [apiKey] = useApiKey();
  const hydrated = useHydrated();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [initialSetupOpen, setInitialSetupOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSettingsSaved = useCallback(() => {
    // Trigger re-fetch by incrementing refresh key
    setRefreshKey((k) => k + 1);
  }, []);

  // 初回ロード後、APIキーがなければ設定ダイアログを表示
  const showInitialSetup = hydrated && !apiKey;

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-foreground">
              Nature Remo Controller
            </h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <AppliancesLoadingSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Nature Remo Controller
              </h1>
              <p className="text-sm text-muted-foreground">
                スマートホームデバイスをブラウザから操作
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              title="設定"
            >
              <Settings className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        {apiKey ? (
          <AppliancesList key={refreshKey} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Key className="size-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              APIキーが設定されていません
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Nature Remoを操作するには、APIキーを設定してください。
            </p>
            <Button onClick={() => setInitialSetupOpen(true)}>
              APIキーを設定
            </Button>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Nature Remo Mini で家電を操作</p>
        </div>
      </footer>

      {/* Settings Dialog */}
      <ApiKeyDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        isInitialSetup={false}
        onSaveSuccess={handleSettingsSaved}
      />

      {/* Initial Setup Dialog */}
      <ApiKeyDialog
        open={showInitialSetup || initialSetupOpen}
        onOpenChange={setInitialSetupOpen}
        isInitialSetup={showInitialSetup}
        onSaveSuccess={handleSettingsSaved}
      />
    </div>
  );
}
