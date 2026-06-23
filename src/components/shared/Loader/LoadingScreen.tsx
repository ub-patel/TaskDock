import React from "react";
import { UI_LABELS } from "@/constants";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps): React.JSX.Element {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-foreground relative overflow-hidden select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center space-y-6 p-8 rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-xl shadow-2xl max-w-sm w-full mx-4">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute w-12 h-12 border-2 border-purple-500/10 border-b-purple-500 rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.2s]"></div>
          <div className="w-4.5 h-4.5 bg-primary rounded-full shadow-[0_0_15px_var(--color-primary)] animate-pulse"></div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm font-semibold text-white tracking-widest uppercase animate-pulse">
            {message || UI_LABELS.COMMON.CHECKING_AUTH}
          </p>
          <p className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase opacity-60">
            {UI_LABELS.COMMON.APP_NAME}
          </p>
        </div>
      </div>
    </div>
  );
}
