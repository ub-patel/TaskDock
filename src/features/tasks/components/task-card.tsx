import { Calendar, Edit2, Trash2 } from "lucide-react";
import { useTaskActions } from "@/store/task.store";
import { UI_LABELS } from "@/constants/ui.constants";
import type { Task, TaskPriority } from "@/types";

interface TaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps): React.JSX.Element {
  const { deleteTask } = useTaskActions();

  const handleEditClick = (): void => {
    onEdit(task.id);
  };

  const handleDeleteClick = async (): Promise<void> => {
    if (window.confirm(UI_LABELS.TASK.CARD.CONFIRM_DELETE)) {
      try {
        await deleteTask(task.id);
      } catch (err) {
        console.error("Failed to delete task", err);
      }
    }
  };

  const getPriorityStyles = (priority: TaskPriority): string => {
    switch (priority) {
      case "LOW":
        return "bg-priority-low/10 text-priority-low border-priority-low/20";
      case "MEDIUM":
        return "bg-priority-medium/10 text-priority-medium border-priority-medium/20";
      case "HIGH":
        return "bg-priority-high/10 text-priority-high border-priority-high/20";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
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

  return (
    <div className="p-4 bg-zinc-900 border border-border rounded-lg shadow-sm hover:shadow-md hover:border-border-hover transition duration-200 flex flex-col justify-between space-y-4 group">
      <div className="space-y-2">
        {/* Card Header: Title & Edit/Delete */}
        <div className="flex items-start justify-between">
          <h4 className="font-semibold text-white tracking-tight break-words flex-1 pr-2">
            {task.title}
          </h4>
          <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEditClick}
              className="p-1 rounded hover:bg-secondary/40 text-muted-foreground hover:text-white transition"
              title={UI_LABELS.TASK.CARD.EDIT}
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1 rounded hover:bg-secondary/40 text-muted-foreground hover:text-rose-400 transition"
              title={UI_LABELS.TASK.CARD.DELETE}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer: Priority Badge and Due Date */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
        <span
          className={`px-2 py-0.5 rounded border text-[10px] font-bold tracking-wider uppercase ${getPriorityStyles(
            task.priority
          )}`}
        >
          {task.priority}
        </span>

        <div className="flex items-center space-x-1 text-muted-foreground">
          <Calendar size={12} />
          <span>{formatDueDate(task.dueDate)}</span>
        </div>
      </div>
    </div>
  );
}
