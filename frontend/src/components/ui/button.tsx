import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
          {
            "bg-stone-900 text-stone-50 shadow-xs hover:bg-stone-800": variant === "default",
            "bg-rose-700 text-rose-50 shadow-xs hover:bg-rose-800": variant === "destructive",
            "border border-stone-200 bg-white shadow-xs hover:bg-stone-50 text-stone-800": variant === "outline",
            "bg-stone-100 text-stone-900 hover:bg-stone-200/80": variant === "secondary",
            "hover:bg-stone-100 text-stone-700 hover:text-stone-900": variant === "ghost",
            "text-[#9a3412] underline-offset-4 hover:underline": variant === "link",
            "bg-[#9a3412] text-amber-50 shadow-xs hover:bg-[#832c0f]": variant === "accent",
          },
          {
            "h-9 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-[11px]": size === "sm",
            "h-10 rounded-md px-6 text-sm": size === "lg",
            "h-8 w-8 p-0": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
