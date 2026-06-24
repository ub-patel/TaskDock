import React from "react";
import { cn } from "@/utils";


interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor={id}>
            {label}
          </label>
        )}
        <textarea
          id={id}
          className={cn(
            "w-full px-4 py-2.5 bg-zinc-900/60 border border-white/10 hover:border-white/20 focus:border-primary rounded-xl outline-none text-sm transition text-white placeholder:text-muted-foreground/60 resize-none disabled:opacity-50",
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

Textarea.displayName = "Textarea";
