import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { APP_ROUTES, UI_LABELS } from "@/constants";
import { useAuthUser } from "@/store/auth.store";
import { Card } from "@/components/shared";


export function ProfilePage(): React.JSX.Element {
  const user = useAuthUser();

  return (
    <div className="p-8 max-w-2xl mx-auto text-foreground">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{UI_LABELS.PROFILE.TITLE}</h1>
        <Link
          to={APP_ROUTES.DASHBOARD}
          className="text-sm text-primary hover:underline inline-flex items-center space-x-1 font-medium"
        >
          <ArrowLeft size={14} />
          <span>{UI_LABELS.COMMON.BACK_TO_DASHBOARD}</span>
        </Link>
      </div>

      <Card className="p-6 bg-card space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xl text-primary">
            {(user?.user_metadata?.full_name || UI_LABELS.PROFILE.DEFAULT_USER_NAME)[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              {user?.user_metadata?.full_name || UI_LABELS.PROFILE.DEFAULT_USER_NAME}
            </h2>
            <p className="text-sm text-muted-foreground">
              {user?.email || UI_LABELS.PROFILE.DEFAULT_USER_EMAIL}
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {UI_LABELS.PROFILE.STATS_HEADER}
          </h3>
          <p className="text-sm text-muted-foreground">{UI_LABELS.PROFILE.STATS_PLACEHOLDER}</p>
        </div>
      </Card>
    </div>
  );
}
