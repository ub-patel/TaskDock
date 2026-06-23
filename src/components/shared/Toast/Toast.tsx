import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { useToast, useUiActions } from "@/store/ui.store";

export function Toast(): React.JSX.Element | null {
  const toast = useToast();
  const { hideToast } = useUiActions();

  if (!toast) return null;

  const typeConfig = {
    error: {
      bg: "bg-zinc-950/80 border-rose-500/30 text-rose-400 shadow-rose-950/10",
      icon: AlertCircle,
    },
    warning: {
      bg: "bg-zinc-950/80 border-amber-500/30 text-amber-400 shadow-amber-950/10",
      icon: AlertTriangle,
    },
    success: {
      bg: "bg-zinc-950/80 border-emerald-500/30 text-emerald-400 shadow-emerald-950/10",
      icon: CheckCircle2,
    },
    info: {
      bg: "bg-zinc-950/80 border-blue-500/30 text-blue-400 shadow-blue-950/10",
      icon: Info,
    },
  };


  const currentType = typeConfig[toast.type] || typeConfig.info;
  const Icon = currentType.icon;

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-fade-in pointer-events-none select-none">
      <div
        className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-solid shadow-2xl backdrop-blur-xl transition duration-300 w-80 max-w-sm pointer-events-auto ${currentType.bg}`}
      >
        <span className="shrink-0">
          <Icon size={18} />
        </span>
        <div className="flex-1 text-sm font-semibold tracking-wide leading-snug break-words">
          {toast.message}
        </div>
        <button
          onClick={hideToast}
          className="shrink-0 text-muted-foreground hover:text-white transition cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
