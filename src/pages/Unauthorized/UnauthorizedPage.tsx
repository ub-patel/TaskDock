import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useAuthUser } from "@/store/auth.store";
import { APP_ROUTES, UI_LABELS } from "@/constants";
import { Button, Card } from "@/components/shared";

export function UnauthorizedPage(): React.JSX.Element {
  const user = useAuthUser();
  const redirectPath = user ? APP_ROUTES.DASHBOARD : APP_ROUTES.LOGIN;
  const buttonText = user ? UI_LABELS.UNAUTHORIZED.BACK_DASHBOARD : UI_LABELS.UNAUTHORIZED.BACK_LOGIN;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-foreground relative overflow-hidden select-none p-6">
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[130px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[110px] pointer-events-none"></div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        <div className="relative inline-flex items-center justify-center p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 shadow-[0_0_50px_rgba(239,68,68,0.1)] animate-bounce [animation-duration:4s]">
          <ShieldAlert size={48} className="animate-pulse" />
        </div>

        <Card className="p-8 bg-zinc-900/40 border-white/5 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
              {UI_LABELS.UNAUTHORIZED.ERROR_CODE}
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {UI_LABELS.UNAUTHORIZED.TITLE}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            {UI_LABELS.UNAUTHORIZED.DESC}
          </p>

          <div className="pt-4 flex justify-center">
            <Link to={redirectPath}>
              <Button size="lg" variant="outline" className="font-semibold active:scale-[0.98] border-rose-500/20 text-rose-300 hover:text-white hover:bg-rose-500/10 transition">
                <ArrowLeft size={16} />
                <span>{buttonText}</span>
              </Button>
            </Link>
          </div>
        </Card>

        <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase opacity-40">
          {UI_LABELS.UNAUTHORIZED.BRAND}
        </p>
      </div>
    </div>
  );
}
