import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { APP_ROUTES } from "@/constants/route.constants";
import { UI_LABELS } from "@/constants/ui.constants";

export function DashboardPage(): React.JSX.Element {
  return (
    <div className="p-8 max-w-4xl mx-auto text-foreground">
      <h1 className="text-3xl font-bold mb-4">{UI_LABELS.DASHBOARD.TITLE}</h1>
      <p className="text-muted-foreground mb-8">{UI_LABELS.DASHBOARD.SUBTITLE}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-card border border-border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">{UI_LABELS.DASHBOARD.KANBAN_CARD_TITLE}</h2>
          <p className="text-sm text-muted-foreground mb-4">{UI_LABELS.DASHBOARD.KANBAN_CARD_DESC}</p>
          <div className="h-20 bg-secondary/50 rounded flex items-center justify-center text-sm border border-border">
            {UI_LABELS.DASHBOARD.KANBAN_CARD_FOOTER}
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">{UI_LABELS.DASHBOARD.PROFILE_CARD_TITLE}</h2>
          <p className="text-sm text-muted-foreground mb-4">{UI_LABELS.DASHBOARD.PROFILE_CARD_DESC}</p>
          <Link
            to={APP_ROUTES.PROFILE}
            className="inline-flex items-center space-x-1 text-primary hover:underline text-sm"
          >
            <span>{UI_LABELS.DASHBOARD.PROFILE_CARD_LINK}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
