import { NavLink } from "react-router-dom";
import { LayoutDashboard, Kanban, User, ChevronLeft, ChevronRight, HardDrive, Settings } from "lucide-react";
import { useSidebarOpen, useUiActions } from "@/store/ui.store";
import { APP_ROUTES, UI_LABELS } from "@/constants";


export function Sidebar(): React.JSX.Element {
  const isOpen = useSidebarOpen();
  const { toggleSidebar } = useUiActions();

  const navItems = [
    { name: UI_LABELS.SIDEBAR.DASHBOARD, path: APP_ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: UI_LABELS.SIDEBAR.KANBAN_BOARD, path: APP_ROUTES.BOARD, icon: Kanban },
    { name: UI_LABELS.SIDEBAR.PROFILE, path: APP_ROUTES.PROFILE, icon: User },
    { name: UI_LABELS.SIDEBAR.SETTINGS, path: APP_ROUTES.SETTINGS, icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-20 h-screen bg-zinc-900 border-r border-border text-foreground transition-all duration-300 flex flex-col ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="h-16 flex items-center px-4 justify-between border-b border-border/80">
        <div className="flex items-center space-x-2 overflow-hidden">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
            <HardDrive size={18} />
          </div>
          {isOpen && (
            <span className="font-bold text-lg tracking-wide text-white transition-opacity duration-300">
              {UI_LABELS.COMMON.APP_NAME}
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary/40 hover:text-white"
              }`
            }
          >
            <item.icon size={18} className="shrink-0" />
            {isOpen && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-border/80 flex justify-end">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-secondary/40 text-muted-foreground hover:text-white transition"
          aria-label={isOpen ? UI_LABELS.SIDEBAR.COLLAPSE : UI_LABELS.SIDEBAR.EXPAND}
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
    </aside>
  );
}
