import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { DashboardPage } from "@/pages/dashboard";
import { BoardPage } from "@/pages/board";
import { ProfilePage } from "@/pages/profile";
import { ProtectedRoute } from "@/components/common/protected-route";
import { PublicRoute } from "@/components/common/public-route";
import { AppLayout } from "@/components/layout/app-layout";
import { APP_ROUTES } from "@/constants/route.constants";

export function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth portal */}
        <Route
          path={APP_ROUTES.LOGIN}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected workspace routes */}
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

        {/* Fallback routing */}
        <Route path="*" element={<Navigate to={APP_ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
