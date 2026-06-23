import React from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { DraggableTaskCard } from "./draggable-task-card";
import { useKanbanDnd } from "../hooks/use-kanban-dnd";
import { UI_LABELS } from "@/constants";
import type { Task } from "@/types";

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (id: string) => void;
}

export function KanbanBoard({ tasks, onEditTask }: KanbanBoardProps): React.JSX.Element {
  const { sensors, handleDragEnd } = useKanbanDnd({ tasks });

  const COLUMNS = [
    { id: "TO_DO", title: UI_LABELS.BOARD.COLUMN_TODO },
    { id: "IN_PROGRESS", title: UI_LABELS.BOARD.COLUMN_IN_PROGRESS },
    { id: "COMPLETED", title: UI_LABELS.BOARD.COLUMN_COMPLETED },
  ] as const;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          const colTaskIds = colTasks.map((t) => t.id);

          return (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              count={colTasks.length}
            >
              <SortableContext items={colTaskIds}>
                {colTasks.map((task) => (
                  <DraggableTaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                  />
                ))}
              </SortableContext>
            </KanbanColumn>
          );
        })}
      </div>
    </DndContext>
  );
}
