import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { DashboardPage } from "@/pages/dashboard";
import { ProfilePage } from "@/pages/profile";
import { APP_ROUTES } from "@/constants/route.constants";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={APP_ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={APP_ROUTES.PROFILE} element={<ProfilePage />} />
        {/* Default redirect to Dashboard */}
        <Route path="*" element={<Navigate to={APP_ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
