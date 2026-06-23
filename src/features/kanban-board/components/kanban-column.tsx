import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { UI_LABELS } from "@/constants";
import { cn } from "@/utils";

interface KanbanColumnProps {
  id: string;
  title: string;
  count: number;
  children: React.ReactNode;
}

export function KanbanColumn({ id, title, count, children }: KanbanColumnProps): React.JSX.Element {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col bg-zinc-900/30 border border-white/5 rounded-2xl p-4 min-h-[550px] transition-all duration-300",
        isOver && "bg-primary/5 border-primary/20 shadow-lg scale-[1.005]"
      )}
    >
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40 select-none">
        <h3 className="font-bold text-white text-xs uppercase tracking-wider">
          {title}
        </h3>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-bold border border-border">
          {count}
        </span>
      </div>

      <div className="flex-1 flex flex-col space-y-3 overflow-y-auto max-h-[600px] scrollbar-thin pr-1 pb-4">
        {count === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6 border border-dashed border-border/40 rounded-xl bg-zinc-900/10 min-h-[120px] select-none text-center">
            <span className="text-xs text-muted-foreground font-medium">
              {UI_LABELS.BOARD.COLUMN_EMPTY}
            </span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
