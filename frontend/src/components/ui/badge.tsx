import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "accent" | "success" | "warning";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold font-mono uppercase tracking-wider transition-colors",
        {
          "border-stone-300 bg-stone-900 text-stone-50": variant === "default",
          "border-stone-200 bg-stone-100 text-stone-700": variant === "secondary",
          "border-rose-300 bg-rose-50 text-rose-800": variant === "destructive",
          "border-stone-300 text-stone-800 bg-white": variant === "outline",
          "border-amber-300 bg-amber-50 text-amber-900": variant === "accent",
          "border-emerald-300 bg-emerald-50 text-emerald-900": variant === "success",
          "border-orange-300 bg-orange-50 text-orange-900": variant === "warning",
        },
        className
      )}
      {...props}
    />
  );
}
