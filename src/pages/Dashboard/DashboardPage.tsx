import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTasks, useTaskActions } from "@/store/task.store";
import { APP_ROUTES, UI_LABELS } from "@/constants";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared";
import { StatsGrid, DeadlinesWidget } from "@/features/dashboard";

export function DashboardPage(): React.JSX.Element {
  const tasks = useTasks();
  const { fetchTasks } = useTaskActions();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="p-8 max-w-6xl mx-auto text-foreground space-y-8 animate-fade-in">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {UI_LABELS.DASHBOARD.TITLE}
        </h1>
        <p className="text-sm text-muted-foreground">
          {UI_LABELS.DASHBOARD.SUBTITLE}
        </p>
      </div>

      <StatsGrid tasks={tasks} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DeadlinesWidget tasks={tasks} />
        </div>

        <div>
          <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-white">
                {UI_LABELS.DASHBOARD.KANBAN_CARD_TITLE}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                {UI_LABELS.DASHBOARD.KANBAN_CARD_DESC}
              </p>
              <Link to={APP_ROUTES.BOARD}>
                <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-md transition select-none cursor-pointer">
                  <span>Open Kanban Board</span>
                  <ArrowRight size={14} />
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
