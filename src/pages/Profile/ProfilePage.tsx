import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, ListTodo, Clock, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { APP_ROUTES, UI_LABELS } from "@/constants";
import { useAuthUser } from "@/store/auth.store";
import { useTasks, useTaskActions } from "@/store/task.store";
import { Card, CardContent } from "@/components/shared";

export function ProfilePage(): React.JSX.Element {
  const user = useAuthUser();
  const tasks = useTasks();
  const { fetchTasks } = useTaskActions();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const total = tasks.length;
  const active = tasks.filter((t) => t.status === "TO_DO" || t.status === "IN_PROGRESS").length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;

  const now = new Date();
  const overdue = tasks.filter((t) => {
    if (t.status === "COMPLETED" || !t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    dueDate.setHours(23, 59, 59, 999);
    return dueDate < now;
  }).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const statsList = [
    {
      label: UI_LABELS.PROFILE.STATS_TOTAL,
      value: total,
      icon: ListTodo,
      colorClass: "text-blue-400 bg-blue-500/5 border-blue-500/10",
    },
    {
      label: UI_LABELS.PROFILE.STATS_ACTIVE,
      value: active,
      icon: Clock,
      colorClass: "text-amber-400 bg-amber-500/5 border-amber-500/10",
    },
    {
      label: UI_LABELS.PROFILE.STATS_COMPLETED,
      value: completed,
      icon: CheckCircle2,
      colorClass: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
    },
    {
      label: UI_LABELS.PROFILE.STATS_OVERDUE,
      value: overdue,
      icon: AlertTriangle,
      colorClass: overdue > 0
        ? "text-rose-400 bg-rose-500/10 border-rose-500/25 animate-pulse"
        : "text-zinc-500 bg-zinc-900/10 border-white/5",
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto text-foreground space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white tracking-tight">
            {UI_LABELS.PROFILE.TITLE}
          </h1>
        </div>
        <Link
          to={APP_ROUTES.DASHBOARD}
          className="text-sm text-primary hover:underline inline-flex items-center space-x-1 font-medium transition"
        >
          <ArrowLeft size={14} />
          <span>{UI_LABELS.COMMON.BACK_TO_DASHBOARD}</span>
        </Link>
      </div>

      <Card className="p-6 bg-zinc-900/40 border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center font-black text-3xl text-white shadow-lg shadow-primary/25 shrink-0 select-none">
            {(user?.user_metadata?.full_name || UI_LABELS.PROFILE.DEFAULT_USER_NAME)[0].toUpperCase()}
          </div>
          <div className="text-center sm:text-left space-y-1.5 min-w-0">
            <h2 className="text-2xl font-bold text-white tracking-tight truncate">
              {user?.user_metadata?.full_name || UI_LABELS.PROFILE.DEFAULT_USER_NAME}
            </h2>
            <p className="text-sm text-muted-foreground truncate">
              {user?.email || UI_LABELS.PROFILE.DEFAULT_USER_EMAIL}
            </p>
            {joinDate && (
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-muted-foreground/80 font-medium">
                <Calendar size={13} className="text-primary" />
                <span>{UI_LABELS.PROFILE.JOINED_DATE}: {joinDate}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight">
          {UI_LABELS.PROFILE.STATS_HEADER}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsList.map((stat) => (
            <Card key={stat.label} className={`border border-solid shadow-md rounded-xl overflow-hidden ${stat.colorClass}`}>
              <CardContent className="p-5 flex flex-col justify-between h-28">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-85 text-zinc-400">
                    {stat.label}
                  </span>
                  <stat.icon size={16} className="opacity-70" />
                </div>
                <span className="text-3xl font-black tracking-tight text-white select-text">
                  {stat.value}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-zinc-900/30 border-white/5 backdrop-blur-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center text-sm font-semibold text-white">
              <span className="flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                {UI_LABELS.PROFILE.STATS_RATE}
              </span>
              <span className="text-primary">{completionRate}%</span>
            </div>
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 shadow-[0_0_10px_var(--color-primary)]"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
