import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils";


interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
}

export function Dialog({
  isOpen,
  onClose,
  size = "md",
  className,
  children,
  ...props
}: DialogProps): React.JSX.Element | null {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div
        className={cn(
          "relative w-full bg-zinc-900 border border-border rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

export function DialogHeader({
  className,
  children,
  onClose,
  ...props
}: DialogHeaderProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "h-14 flex items-center justify-between px-6 border-b border-border/80 bg-zinc-900/50",
        className
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="p-1.5 rounded-md hover:bg-secondary/40 text-muted-foreground hover:text-white transition cursor-pointer"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>): React.JSX.Element {
  return <h3 className={cn("font-bold text-lg text-white", className)} {...props} />;
}

export function DialogBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn("p-6", className)} {...props} />;
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex items-center justify-end space-x-3 pt-4 border-t border-border/80",
        className
      )}
      {...props}
    />
  );
}
