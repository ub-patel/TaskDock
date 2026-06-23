import React from "react";
import { cn } from "@/utils";


interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function Loader({ size = "md", className, ...props }: LoaderProps): React.JSX.Element {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
    lg: "w-8 h-8 border-4",
  };

  return (
    <div
      className={cn(
        "border-current border-t-transparent rounded-full animate-spin",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
