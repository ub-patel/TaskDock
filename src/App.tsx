import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/pages/Login/LoginPage";
import { DashboardPage } from "@/pages/Dashboard/DashboardPage";
import { BoardPage } from "@/pages/Board/BoardPage";
import { ProfilePage } from "@/pages/Profile/ProfilePage";
import { SettingsPage } from "@/pages/Settings/SettingsPage";
import { NotFoundPage } from "@/pages/NotFound/NotFoundPage";
import { UnauthorizedPage } from "@/pages/Unauthorized/UnauthorizedPage";
import { ProtectedRoute, PublicRoute } from "@/components/common";
import { AppLayout } from "@/components/layout";
import { APP_ROUTES } from "@/constants";


export function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={APP_ROUTES.LOGIN} replace />} />

        <Route
          path={APP_ROUTES.LOGIN}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path={APP_ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.BOARD}
          element={
            <ProtectedRoute>
              <AppLayout>
                <BoardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.SETTINGS}
          element={
            <ProtectedRoute>
              <AppLayout>
                <SettingsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route path={APP_ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
        <Route path={APP_ROUTES.NOT_FOUND} element={<NotFoundPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
