import React from "react";
import { ListTodo, CheckCircle2, Clock, AlertTriangle, BarChart3, User, FolderPlus } from "lucide-react";
import { UI_LABELS } from "@/constants";
import type { Task } from "@/types";
import { Card, CardContent } from "@/components/shared";
import { useAuthUser } from "@/store/auth.store";

interface StatsGridProps {
  tasks: Task[];
}

export function StatsGrid({ tasks }: StatsGridProps): React.JSX.Element {
  const user = useAuthUser();
  const userId = user?.id;

  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === "TO_DO").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;

  const now = new Date();
  const overdue = tasks.filter((t) => {
    if (t.status === "COMPLETED" || !t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    dueDate.setHours(23, 59, 59, 999);
    return dueDate < now;
  }).length;

  // Personal metrics based on assignment
  const assignedToMe = userId ? tasks.filter((t) => t.assignedUserId === userId).length : 0;
  const createdByMe = userId ? tasks.filter((t) => t.createdBy === userId).length : 0;
  const overdueAssignedToMe = userId
    ? tasks.filter((t) => {
        if (t.status === "COMPLETED" || t.assignedUserId !== userId || !t.dueDate) return false;
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(23, 59, 59, 999);
        return dueDate < now;
      }).length
    : 0;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const statItems = [
    {
      title: UI_LABELS.DASHBOARD.STATS_TOTAL,
      value: total,
      icon: ListTodo,
      colorClass: "text-blue-400 border-blue-500/10 bg-blue-500/5",
    },
    {
      title: UI_LABELS.DASHBOARD.STATS_TODO,
      value: todo,
      icon: Clock,
      colorClass: "text-zinc-400 border-zinc-700 bg-zinc-800/20",
    },
    {
      title: UI_LABELS.DASHBOARD.STATS_IN_PROGRESS,
      value: inProgress,
      icon: BarChart3,
      colorClass: "text-amber-400 border-amber-500/10 bg-amber-500/5",
    },
    {
      title: UI_LABELS.DASHBOARD.STATS_COMPLETED,
      value: completed,
      icon: CheckCircle2,
      colorClass: "text-emerald-400 border-emerald-500/10 bg-emerald-500/5",
    },
    {
      title: "Assigned To Me",
      value: assignedToMe,
      icon: User,
      colorClass: "text-indigo-400 border-indigo-500/10 bg-indigo-500/5",
    },
    {
      title: "Created By Me",
      value: createdByMe,
      icon: FolderPlus,
      colorClass: "text-violet-400 border-violet-500/10 bg-violet-500/5",
    },
    {
      title: "Overdue (Assigned To Me)",
      value: overdueAssignedToMe,
      icon: AlertTriangle,
      colorClass: overdueAssignedToMe > 0 
        ? "text-rose-400 border-rose-500/25 bg-rose-500/10 animate-pulse" 
        : "text-zinc-500 border-white/5 bg-zinc-900/10",
    },
    {
      title: "Overdue (Total)",
      value: overdue,
      icon: AlertTriangle,
      colorClass: overdue > 0 
        ? "text-rose-500 border-rose-500/25 bg-rose-500/10" 
        : "text-zinc-500 border-white/5 bg-zinc-900/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <Card key={item.title} className={`border border-solid shadow-lg rounded-xl overflow-hidden ${item.colorClass}`}>
            <CardContent className="p-5 flex flex-col justify-between h-28">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider opacity-85 text-zinc-400 truncate pr-2">
                  {item.title}
                </span>
                <item.icon size={16} className="opacity-70 shrink-0" />
              </div>
              <span className="text-3xl font-black tracking-tight text-white select-text">
                {item.value}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-zinc-900/30 border-white/5 backdrop-blur-xl">
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold text-white">
            <span>{UI_LABELS.DASHBOARD.STATS_COMPLETION_RATE}</span>
            <span className="text-primary">{completionRate}%</span>
          </div>
          <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 shadow-[0_0_10px_var(--color-primary)]"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
