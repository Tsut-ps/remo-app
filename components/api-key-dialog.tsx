"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiKey } from "@/lib/store";
import { fetchAppliances } from "@/lib/api-client";
import { Eye, EyeOff, ExternalLink } from "lucide-react";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isInitialSetup?: boolean;
  onSaveSuccess?: () => void;
}

export function ApiKeyDialog({
  open,
  onOpenChange,
  isInitialSetup = false,
  onSaveSuccess,
}: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useApiKey();
  const [inputValue, setInputValue] = useState(apiKey || "");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const handleSave = useCallback(async () => {
    if (!inputValue.trim()) {
      setError("APIキーを入力してください");
      return;
    }

    setTesting(true);
    setError(null);

    try {
      // Test the API key by making a request directly to Nature API
      await fetchAppliances(inputValue.trim());

      setApiKey(inputValue.trim());
      onOpenChange(false);
      onSaveSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "APIキーの検証に失敗しました"
      );
    } finally {
      setTesting(false);
    }
  }, [inputValue, setApiKey, onOpenChange, onSaveSuccess]);

  const handleClear = useCallback(() => {
    setApiKey("");
    setInputValue("");
    onOpenChange(false);
  }, [setApiKey, onOpenChange]);

  return (
    <Dialog
      open={open}
      onOpenChange={isInitialSetup ? undefined : onOpenChange}
    >
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={
          isInitialSetup ? (e) => e.preventDefault() : undefined
        }
      >
        <DialogHeader>
          <DialogTitle>
            {isInitialSetup ? "Nature Remo APIキーの設定" : "APIキー設定"}
          </DialogTitle>
          <DialogDescription>
            {isInitialSetup
              ? "Nature Remoを操作するにはAPIキーが必要です。"
              : "APIキーを変更または削除できます。"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">APIキー</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError(null);
                }}
                placeholder="Bearer トークンを入力..."
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">APIキーの取得方法:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Natureアプリを開く</li>
              <li>設定 → API を選択</li>
              <li>アクセストークンを生成</li>
            </ol>
            <a
              href="https://home.nature.global/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline mt-2"
            >
              Nature Home にアクセス
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {!isInitialSetup && apiKey && (
            <Button
              variant="destructive"
              onClick={handleClear}
              className="sm:mr-auto"
            >
              キーを削除
            </Button>
          )}
          {!isInitialSetup && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
          )}
          <Button onClick={handleSave} disabled={testing}>
            {testing ? "検証中..." : "保存して接続"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
