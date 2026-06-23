import React from "react";
import { cn } from "@/utils";


interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "low" | "medium" | "high" | "secondary" | "default";
}

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps): React.JSX.Element {
  const baseStyles =
    "px-2 py-0.5 rounded border text-[10px] font-bold tracking-wider uppercase inline-flex items-center justify-center";

  const variants = {
    low: "bg-priority-low/10 text-priority-low border-priority-low/20",
    medium: "bg-priority-medium/10 text-priority-medium border-priority-medium/20",
    high: "bg-priority-high/10 text-priority-high border-priority-high/20",
    secondary: "bg-secondary text-secondary-foreground border-border",
    default: "bg-zinc-800 text-zinc-400 border-zinc-700",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
