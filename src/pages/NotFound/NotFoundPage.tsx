import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";
import { useAuthUser } from "@/store/auth.store";
import { APP_ROUTES, UI_LABELS } from "@/constants";
import { Button, Card } from "@/components/shared";

export function NotFoundPage(): React.JSX.Element {
  const user = useAuthUser();
  const redirectPath = user ? APP_ROUTES.DASHBOARD : APP_ROUTES.LOGIN;
  const buttonText = user ? UI_LABELS.NOT_FOUND.GO_DASHBOARD : UI_LABELS.NOT_FOUND.GO_LOGIN;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-foreground relative overflow-hidden select-none p-6">
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[130px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[110px] pointer-events-none"></div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        <div className="relative inline-block select-text">
          <h1 className="text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 drop-shadow-[0_10px_35px_rgba(255,255,255,0.08)] animate-bounce [animation-duration:3s]">
            404
          </h1>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 border border-primary/20 rounded-full flex items-center justify-center text-primary animate-pulse">
            <Compass size={22} className="animate-spin [animation-duration:15s]" />
          </div>
        </div>

        <Card className="p-8 bg-zinc-900/40 border-white/5 backdrop-blur-xl shadow-2xl space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {UI_LABELS.NOT_FOUND.TITLE}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            {UI_LABELS.NOT_FOUND.DESC}
          </p>

          <div className="pt-4 flex justify-center">
            <Link to={redirectPath}>
              <Button size="lg" className="font-semibold shadow-[0_4px_20px_var(--color-primary)] active:scale-[0.98] transition">
                <ArrowLeft size={16} />
                <span>{buttonText}</span>
              </Button>
            </Link>
          </div>
        </Card>

        <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase opacity-40">
          {UI_LABELS.NOT_FOUND.BRAND}
        </p>
      </div>
    </div>
  );
}
