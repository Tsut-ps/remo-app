import { AppliancesList } from "@/components/appliances-list";
import { Suspense } from "react";
import { AppliancesLoadingSkeleton } from "@/components/appliances";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
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
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<AppliancesLoadingSkeleton />}>
          <AppliancesList />
        </Suspense>
      </main>

      <footer className="border-t border-border mt-auto py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Nature Remo Mini で家電を操作</p>
        </div>
      </footer>
    </div>
  );
}
