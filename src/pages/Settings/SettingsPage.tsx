import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { APP_ROUTES, UI_LABELS } from "@/constants";
import { useCurrentTheme, useUiActions, THEME_OPTIONS } from "@/store/ui.store";
import { Card } from "@/components/shared";


export function SettingsPage(): React.JSX.Element {
  const currentTheme = useCurrentTheme();
  const { setTheme } = useUiActions();

  return (
    <div className="p-8 max-w-4xl mx-auto text-foreground space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {UI_LABELS.SETTINGS.TITLE}
          </h1>
          <p className="text-sm text-muted-foreground">
            {UI_LABELS.SETTINGS.SUBTITLE}
          </p>
        </div>
        <Link
          to={APP_ROUTES.DASHBOARD}
          className="text-sm text-primary hover:underline inline-flex items-center space-x-1"
        >
          <ArrowLeft size={14} />
          <span>{UI_LABELS.COMMON.BACK_TO_DASHBOARD}</span>
        </Link>
      </div>

      <Card className="p-6 space-y-6">
        <div className="border-b border-border/80 pb-4">
          <h2 className="text-xl font-semibold text-white">
            {UI_LABELS.SETTINGS.THEME_TITLE}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {UI_LABELS.SETTINGS.THEME_DESC}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {THEME_OPTIONS.map((theme) => {
            const isActive = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-200 group text-left cursor-pointer ${
                  isActive
                    ? "border-primary bg-primary/5 shadow-md scale-[1.01]"
                    : "border-border bg-zinc-900/40 hover:border-border-hover hover:bg-secondary/20 hover:scale-[1.01]"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-5 h-5 rounded-full border border-white/10 shrink-0"
                    style={{ backgroundColor: theme.primary }}
                  ></div>
                  <span className={`text-sm font-medium transition ${
                    isActive ? "text-white animate-pulse" : "text-muted-foreground group-hover:text-white"
                  }`}>
                    {theme.name}
                  </span>
                </div>

                {isActive && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
