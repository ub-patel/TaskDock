import { Calendar, Edit2, Trash2 } from "lucide-react";
import { useTaskActions } from "@/store/task.store";
import { UI_LABELS } from "@/constants";
import type { Task } from "@/types";
import { Card, Badge, Button } from "@/components/shared";


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
    <Card className="p-4 hover:border-border-hover transition duration-200 flex flex-col justify-between space-y-4 group">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h4 className="font-semibold text-white tracking-tight break-words flex-1 pr-2">
            {task.title}
          </h4>
          <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={handleEditClick}
              variant="ghost"
              size="icon"
              title={UI_LABELS.TASK.CARD.EDIT}
              className="text-muted-foreground hover:text-white"
            >
              <Edit2 size={13} />
            </Button>
            <Button
              onClick={handleDeleteClick}
              variant="ghost"
              size="icon"
              title={UI_LABELS.TASK.CARD.DELETE}
              className="text-muted-foreground hover:text-rose-400"
            >
              <Trash2 size={13} />
            </Button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
        <Badge variant={task.priority.toLowerCase() as "low" | "medium" | "high"}>
          {task.priority}
        </Badge>

        <div className="flex items-center space-x-1 text-muted-foreground">
          <Calendar size={12} />
          <span>{formatDueDate(task.dueDate)}</span>
        </div>
      </div>
    </Card>
  );
}
