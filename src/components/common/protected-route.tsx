import { Navigate } from "react-router-dom";
import { useAuthUser, useAuthLoading } from "@/store/auth.store";
import { APP_ROUTES } from "@/constants/route.constants";
import { UI_LABELS } from "@/constants/ui.constants";
import type { ChildrenProps } from "@/types";

export function ProtectedRoute({ children }: ChildrenProps): React.JSX.Element {
  const user = useAuthUser();
  const loading = useAuthLoading();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground animate-pulse">
            {UI_LABELS.COMMON.CHECKING_AUTH}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
