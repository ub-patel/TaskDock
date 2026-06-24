import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTasks, useTasksLoading, useTaskActions } from "@/store/task.store";
import { APP_ROUTES, UI_LABELS } from "@/constants";
import { Card, CardHeader, CardTitle, CardContent, Skeleton } from "@/components/shared";
import { StatsGrid, DeadlinesWidget } from "@/features/dashboard";


export function DashboardPage(): React.JSX.Element {
  const tasks = useTasks();
  const loading = useTasksLoading();
  const { fetchTasks, fetchProfiles } = useTaskActions();

  useEffect(() => {
    fetchTasks();
    fetchProfiles();
  }, [fetchTasks, fetchProfiles]);

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

      {loading && tasks.length === 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="border border-solid border-white/5 bg-zinc-900/10">
                <CardContent className="p-5 flex flex-col justify-between h-28">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-8 w-12 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-zinc-900/30 border-white/5 backdrop-blur-xl">
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-4 w-8 rounded" />
              </div>
              <Skeleton className="w-full h-2.5 rounded-full" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-36 rounded" />
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-solid border-white/5 bg-zinc-900/60">
                      <div className="space-y-1 flex-1 pr-4">
                        <Skeleton className="h-4 w-1/3 rounded" />
                        <Skeleton className="h-3 w-1/4 rounded" />
                      </div>
                      <Skeleton className="h-4 w-16 rounded shrink-0" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-24 rounded" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-8 w-full rounded-md" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

