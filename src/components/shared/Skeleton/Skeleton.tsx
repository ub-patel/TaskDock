import React from "react";
import { cn } from "@/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps): React.JSX.Element {
  return (
    <div
      className={cn("animate-pulse rounded bg-zinc-800/60", className)}
      {...props}
    />
  );
}
