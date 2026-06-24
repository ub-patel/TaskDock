import React from "react";
import { Edit2, Trash2, Calendar } from "lucide-react";
import { useTaskActions, useProfiles } from "@/store/task.store";
import { UI_LABELS } from "@/constants";
import type { Task } from "@/types";
import { Badge, Button } from "@/components/shared";

interface TaskListTableProps {
  tasks: Task[];
  onEditTask: (id: string) => void;
}

export function TaskListTable({ tasks, onEditTask }: TaskListTableProps): React.JSX.Element {
  const { deleteTask } = useTaskActions();
  const profiles = useProfiles();

  const getAssigneeName = (assignedUserId?: string): string => {
    if (!assignedUserId) return "Unassigned";
    const profile = profiles.find((p) => p.id === assignedUserId);
    return profile ? profile.fullName : "Unassigned";
  };

  const getAssigneeInitials = (assignedUserId?: string): string => {
    const name = getAssigneeName(assignedUserId);
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";
  };

  const formatDueDate = (dateStr?: string): string => {
    if (!dateStr) return UI_LABELS.TASK.CARD.NO_DUE_DATE;
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDeleteClick = async (id: string): Promise<void> => {
    if (window.confirm(UI_LABELS.TASK.CARD.CONFIRM_DELETE)) {
      try {
        await deleteTask(id);
      } catch (err) {
        console.error("Failed to delete task", err);
      }
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-solid border-white/5 bg-zinc-950/20 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 text-zinc-400 text-xs uppercase font-bold tracking-wider select-none bg-zinc-900/30">
            <th className="py-4 px-6">Task Title</th>
            <th className="py-4 px-6">Priority</th>
            <th className="py-4 px-6">Status</th>
            <th className="py-4 px-6">Due Date</th>
            <th className="py-4 px-6">Assigned To</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-sm text-zinc-300">
          {tasks.map((task) => {
            const assigneeName = getAssigneeName(task.assignedUserId);
            const initials = getAssigneeInitials(task.assignedUserId);

            return (
              <tr key={task.id} className="hover:bg-white/2 transition duration-150">
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    <span className="font-semibold text-white block break-words max-w-md">
                      {task.title}
                    </span>
                    {task.description && (
                      <span className="text-xs text-muted-foreground line-clamp-1 block max-w-md">
                        {task.description}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <Badge variant={task.priority.toLowerCase() as "low" | "medium" | "high"}>
                    {task.priority}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold select-none ${
                    task.status === "COMPLETED"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : task.status === "IN_PROGRESS"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-zinc-800 text-zinc-300 border border-zinc-700/50"
                  }`}>
                    {task.status === "COMPLETED"
                      ? UI_LABELS.TASK.STATUS.COMPLETED
                      : task.status === "IN_PROGRESS"
                      ? UI_LABELS.TASK.STATUS.IN_PROGRESS
                      : UI_LABELS.TASK.STATUS.TO_DO}
                  </span>
                </td>
                <td className="py-4 px-6 text-zinc-400">
                  <div className="flex items-center space-x-1.5">
                    <Calendar size={13} className="text-zinc-500" />
                    <span>{formatDueDate(task.dueDate)}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full bg-zinc-800 border border-solid border-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-300"
                      title={assigneeName}
                    >
                      {initials}
                    </div>
                    <span className="text-zinc-300 font-medium truncate max-w-[120px]" title={assigneeName}>
                      {assigneeName}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      onClick={() => onEditTask(task.id)}
                      variant="ghost"
                      size="icon"
                      title={UI_LABELS.TASK.CARD.EDIT}
                      className="text-muted-foreground hover:text-white"
                    >
                      <Edit2 size={13} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(task.id)}
                      variant="ghost"
                      size="icon"
                      title={UI_LABELS.TASK.CARD.DELETE}
                      className="text-muted-foreground hover:text-rose-400"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
