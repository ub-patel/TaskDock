import React from "react";
import { Calendar, AlertTriangle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_ROUTES, UI_LABELS } from "@/constants";
import type { Task } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared";

interface DeadlinesWidgetProps {
  tasks: Task[];
}

export function DeadlinesWidget({ tasks }: DeadlinesWidgetProps): React.JSX.Element {
  const now = new Date();
  
  const upcomingTasks = tasks
    .filter((t) => t.status !== "COMPLETED" && t.dueDate)
    .map((t) => {
      const dueDate = new Date(t.dueDate!);
      dueDate.setHours(23, 59, 59, 999);
      const isOverdue = dueDate < now;
      return { ...t, isOverdue, dueDateObj: dueDate };
    })
    .sort((a, b) => a.dueDateObj.getTime() - b.dueDateObj.getTime())
    .slice(0, 5);

  const formatDueDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar size={18} className="text-primary" />
          <span>{UI_LABELS.DASHBOARD.DEADLINES_TITLE}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {upcomingTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            {UI_LABELS.DASHBOARD.DEADLINES_EMPTY}
          </p>
        ) : (
          <div className="space-y-2">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border border-solid transition duration-200 ${
                  task.isOverdue
                    ? "bg-rose-500/5 border-rose-500/10 hover:border-rose-500/20"
                    : "bg-zinc-900/60 border-white/5 hover:border-zinc-800"
                }`}
              >
                <div className="space-y-1 pr-4 min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="capitalize">{task.priority.toLowerCase()}</span>
                    <span>•</span>
                    <span className="capitalize">{task.status.replace("_", " ").toLowerCase()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {task.isOverdue ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/25 animate-pulse uppercase">
                      <AlertTriangle size={10} />
                      <span>{UI_LABELS.DASHBOARD.DEADLINES_OVERDUE_ALARM}</span>
                    </span>
                  ) : null}
                  <span className={`text-xs font-semibold ${task.isOverdue ? "text-rose-400" : "text-zinc-400"}`}>
                    {formatDueDate(task.dueDate!)}
                  </span>
                  <Link to={APP_ROUTES.BOARD} className="text-muted-foreground hover:text-white transition">
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
