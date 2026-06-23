import React from "react";
import { cn } from "@/utils";
import { Loader } from "../Loader";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps): React.JSX.Element {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none";

  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm active:scale-[0.98]",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
    outline: "border border-border bg-zinc-900/50 hover:bg-secondary/40 hover:text-white text-muted-foreground active:scale-[0.98]",
    ghost: "text-muted-foreground hover:bg-secondary/40 hover:text-white",
    danger: "bg-destructive/10 text-destructive-foreground border border-destructive/20 hover:bg-destructive/20 hover:text-rose-400 active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
    icon: "p-1.5 rounded-md",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader size={size === "lg" ? "md" : "sm"} /> : children}
    </button>
  );
}
