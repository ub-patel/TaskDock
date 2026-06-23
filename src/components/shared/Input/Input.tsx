import React from "react";
import { cn } from "@/utils";


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, label, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor={id}>
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          className={cn(
            "w-full px-4 py-2 bg-secondary/20 border border-border focus:border-primary rounded-md outline-none text-sm transition text-white placeholder:text-muted-foreground/60 disabled:opacity-50",
            error && "border-rose-500 focus:border-rose-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-rose-500 block">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
