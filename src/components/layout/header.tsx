import { useState } from "react";
import { useLocation } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuthUser } from "@/store/auth.store";
import { AuthService } from "@/services/auth.service";
import { APP_ROUTES } from "@/constants/route.constants";

export function Header() {
  const location = useLocation();
  const user = useAuthUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Dynamic route titles
  const getPageTitle = () => {
    switch (location.pathname) {
      case APP_ROUTES.DASHBOARD:
        return "Dashboard";
      case APP_ROUTES.BOARD:
        return "Kanban Board";
      case APP_ROUTES.PROFILE:
        return "User Profile";
      default:
        return "Workspace";
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await AuthService.signOut();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      <h2 className="text-xl font-bold text-white tracking-tight">{getPageTitle()}</h2>

      <div className="flex items-center space-x-4">
        {/* User Info */}
        <div className="hidden sm:flex items-center space-x-2 text-right">
          <div className="text-xs">
            <p className="font-semibold text-white">
              {user?.user_metadata?.full_name || "Workspace User"}
            </p>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-primary font-bold text-sm">
            <User size={14} />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="p-2 rounded-md border border-border bg-zinc-900 text-muted-foreground hover:text-rose-400 hover:border-rose-500/20 transition-colors disabled:opacity-50"
          title="Sign Out"
        >
          {isLoggingOut ? (
            <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <LogOut size={16} />
          )}
        </button>
      </div>
    </header>
  );
}
