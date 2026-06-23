import { Navigate } from "react-router-dom";
import { useAuthUser, useAuthLoading } from "@/store/auth.store";
import { APP_ROUTES, UI_LABELS } from "@/constants";
import type { ChildrenProps } from "@/types";
import { LoadingScreen } from "@/components/shared";

export function PublicRoute({ children }: ChildrenProps): React.JSX.Element {
  const user = useAuthUser();
  const loading = useAuthLoading();

  if (loading) {
    return <LoadingScreen message={UI_LABELS.COMMON.CHECKING_AUTH} />;
  }


  if (user) {
    return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}
