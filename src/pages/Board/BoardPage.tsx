import { useEffect, useState } from "react";
import { TaskToolbar, TaskFormDialog, TaskListTable } from "@/features/tasks";
import { KanbanBoard } from "@/features/kanban-board";
import { useTasks, useTasksLoading, useTasksError, useTaskActions } from "@/store/task.store";
import { useAuthUser } from "@/store/auth.store";
import { UI_LABELS } from "@/constants";
import { useDebounce } from "@/hooks";
import { Skeleton } from "@/components/shared";
import { Kanban, List } from "lucide-react";

export function BoardPage(): React.JSX.Element {
  const tasks = useTasks();
  const loading = useTasksLoading();
  const error = useTasksError();
  const { fetchTasks, fetchProfiles } = useTaskActions();
  const user = useAuthUser();

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [taskIdToEdit, setTaskIdToEdit] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  useEffect(() => {
    fetchTasks();
    fetchProfiles();
  }, [fetchTasks, fetchProfiles]);

  const handleAddTaskClick = (): void => {
    setTaskIdToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditTaskClick = (id: string): void => {
    setTaskIdToEdit(id);
    setIsFormOpen(true);
  };

  const handleCloseForm = (): void => {
    setIsFormOpen(false);
    setTaskIdToEdit(null);
  };

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter;
      
      let matchesAssignee = true;
      if (assigneeFilter === "ME") {
        matchesAssignee = task.assignedUserId === user?.id;
      } else if (assigneeFilter !== "ALL") {
        matchesAssignee = task.assignedUserId === assigneeFilter;
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    })
    .sort((a, b) => {
      if (sortBy === "created_at") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "due_date") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === "priority") {
        const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return 0;
    });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">{UI_LABELS.BOARD.TITLE}</h1>
          <p className="text-sm text-muted-foreground">{UI_LABELS.BOARD.SUBTITLE}</p>
        </div>

        <div className="inline-flex rounded-lg p-0.5 bg-zinc-900 border border-solid border-white/5 select-none shrink-0 self-start sm:self-center">
          <button
            onClick={() => setViewMode("board")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
              viewMode === "board"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Kanban size={13} />
            <span>Board View</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
              viewMode === "list"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <List size={13} />
            <span>List View</span>
          </button>
        </div>
      </div>

      <TaskToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        assigneeFilter={assigneeFilter}
        onAssigneeChange={setAssigneeFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onAddTaskClick={handleAddTaskClick}
      />

      {loading && tasks.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((colIndex) => (
            <div key={colIndex} className="bg-zinc-900/30 border border-solid border-white/5 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24 rounded-lg" />
                <Skeleton className="h-5 w-6 rounded-full" />
              </div>
              <div className="space-y-3">
                {[1, 2].map((cardIndex) => (
                  <div key={cardIndex} className="p-4 rounded-xl border border-solid border-white/5 bg-zinc-950/20 space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-4/5 rounded" />
                      <Skeleton className="h-3 w-3/5 rounded" />
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-5 w-14 rounded-full" />
                      <Skeleton className="h-4 w-20 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 rounded-md border border-destructive/20 bg-destructive/10 text-destructive-foreground text-sm text-center">
          {error}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="h-64 border border-border border-dashed rounded-xl flex flex-col items-center justify-center text-center p-8 space-y-2">
          <p className="font-semibold text-white">{UI_LABELS.TASK.NO_TASKS_FOUND}</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            {UI_LABELS.TASK.NO_TASKS_DESC}
          </p>
        </div>
      ) : viewMode === "list" ? (
        <TaskListTable tasks={filteredTasks} onEditTask={handleEditTaskClick} />
      ) : (
        <KanbanBoard tasks={filteredTasks} onEditTask={handleEditTaskClick} />
      )}

      <TaskFormDialog
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        taskIdToEdit={taskIdToEdit}
      />
    </div>
  );
}
