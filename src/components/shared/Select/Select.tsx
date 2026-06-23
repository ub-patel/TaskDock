import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils";


interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, label, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor={id}>
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            className={cn(
              "w-full pl-4 pr-10 py-2 bg-secondary/25 border border-border focus:border-primary rounded-md outline-none text-sm transition text-white appearance-none cursor-pointer disabled:opacity-50",
              error && "border-rose-500 focus:border-rose-500",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
            size={16}
          />
        </div>
        {error && <span className="text-xs text-rose-500 block">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
