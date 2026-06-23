import { useSensor, useSensors, PointerSensor, type DragEndEvent } from "@dnd-kit/core";
import { useTaskActions } from "@/store/task.store";
import { UI_LABELS } from "@/constants";
import type { Task, TaskStatus } from "@/types";

interface UseKanbanDndProps {
  tasks: Task[];
}

export function useKanbanDnd({ tasks }: UseKanbanDndProps) {
  const { updateTask } = useTaskActions();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    let targetStatus = over.id as string;

    if (
      targetStatus !== "TO_DO" &&
      targetStatus !== "IN_PROGRESS" &&
      targetStatus !== "COMPLETED"
    ) {
      const targetTask = tasks.find((t) => t.id === targetStatus);
      if (targetTask) {
        targetStatus = targetTask.status;
      } else {
        return;
      }
    }

    const currentTask = tasks.find((t) => t.id === taskId);
    if (!currentTask || currentTask.status === targetStatus) return;

    try {
      await updateTask(taskId, { status: targetStatus as TaskStatus });
    } catch {
      window.alert(UI_LABELS.BOARD.DRAG_ERROR);
    }
  };

  return { sensors, handleDragEnd };
}
