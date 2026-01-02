"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X, Loader2 } from "lucide-react";

interface ActionButtonProps {
  onClick: () => Promise<boolean>;
  children: React.ReactNode;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
  disabled?: boolean;
}

type ButtonState = "idle" | "loading" | "success" | "error";

export function ActionButton({
  onClick,
  children,
  className,
  variant = "outline",
  size = "default",
  disabled = false,
}: ActionButtonProps) {
  const [state, setState] = useState<ButtonState>("idle");

  const handleClick = useCallback(async () => {
    if (state === "loading") return;

    setState("loading");
    try {
      const success = await onClick();
      setState(success ? "success" : "error");
    } catch {
      setState("error");
    }

    // Reset after 1.5 seconds
    setTimeout(() => {
      setState("idle");
    }, 1500);
  }, [onClick, state]);

  const stateClasses = {
    idle: "",
    loading: "opacity-70",
    success: "bg-green-600/20 border-green-600/50 text-green-400",
    error: "bg-red-600/20 border-red-600/50 text-red-400",
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled || state === "loading"}
      className={cn(
        "transition-all duration-200",
        stateClasses[state],
        className
      )}
    >
      {state === "loading" ? (
        <Loader2 className="size-4 animate-spin" />
      ) : state === "success" ? (
        <Check className="size-4" />
      ) : state === "error" ? (
        <X className="size-4" />
      ) : null}
      {state === "idle" && children}
      {state === "success" && <span className="ml-1">成功</span>}
      {state === "error" && <span className="ml-1">失敗</span>}
    </Button>
  );
}
