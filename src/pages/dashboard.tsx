import { Link } from "react-router-dom";
import { APP_ROUTES } from "@/constants/route.constants";

export function DashboardPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto text-foreground">
      <h1 className="text-3xl font-bold mb-4">TaskDock Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome to your task management workspace.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-card border border-border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Kanban Board</h2>
          <p className="text-sm text-muted-foreground mb-4">Manage and track your tasks visually.</p>
          <div className="h-20 bg-secondary/50 rounded flex items-center justify-center text-sm border border-border">
            Kanban workflow will be implemented in Phase 4.
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">User Profile</h2>
          <p className="text-sm text-muted-foreground mb-4">Check your account status and session metadata.</p>
          <Link to={APP_ROUTES.PROFILE} className="inline-block text-primary hover:underline text-sm">
            View Profile &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
