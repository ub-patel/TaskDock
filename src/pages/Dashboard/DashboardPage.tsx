import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { APP_ROUTES, UI_LABELS } from "@/constants";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared";


export function DashboardPage(): React.JSX.Element {
  return (
    <div className="p-8 max-w-4xl mx-auto text-foreground">
      <h1 className="text-3xl font-bold mb-4">{UI_LABELS.DASHBOARD.TITLE}</h1>
      <p className="text-muted-foreground mb-8">{UI_LABELS.DASHBOARD.SUBTITLE}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">{UI_LABELS.DASHBOARD.KANBAN_CARD_TITLE}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">{UI_LABELS.DASHBOARD.KANBAN_CARD_DESC}</p>
            <div className="h-20 bg-secondary/50 rounded flex items-center justify-center text-sm border border-border text-center px-4">
              {UI_LABELS.DASHBOARD.KANBAN_CARD_FOOTER}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">{UI_LABELS.DASHBOARD.PROFILE_CARD_TITLE}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">{UI_LABELS.DASHBOARD.PROFILE_CARD_DESC}</p>
            <Link
              to={APP_ROUTES.PROFILE}
              className="inline-flex items-center space-x-1 text-primary hover:underline text-sm font-medium"
            >
              <span>{UI_LABELS.DASHBOARD.PROFILE_CARD_LINK}</span>
              <ArrowRight size={14} />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
