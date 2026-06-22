import { useEffect, useState } from "react";
import { TaskToolbar } from "@/features/tasks/components/task-toolbar";
import { TaskCard } from "@/features/tasks/components/task-card";
import { TaskFormDialog } from "@/features/tasks/components/task-form-dialog";
import { useTasks, useTasksLoading, useTasksError, useTaskActions } from "@/store/task.store";
import { UI_LABELS } from "@/constants/ui.constants";
import { useDebounce } from "@/hooks/use-debounce";

export function BoardPage(): React.JSX.Element {
  const tasks = useTasks();
  const loading = useTasksLoading();
  const error = useTasksError();
  const { fetchTasks } = useTaskActions();

  // Dialog State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [taskIdToEdit, setTaskIdToEdit] = useState<string | null>(null);

  // Filter/Sort States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("created_at");

  // Debounced search query to prevent excessive filtration runs
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  // Load Tasks on Mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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

  // Compute Filtered and Sorted Tasks in-render (Derived State)
  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
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
      {/* Page Header */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">{UI_LABELS.BOARD.TITLE}</h1>
        <p className="text-sm text-muted-foreground">{UI_LABELS.BOARD.SUBTITLE}</p>
      </div>

      {/* Control Toolbar */}
      <TaskToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onAddTaskClick={handleAddTaskClick}
      />

      {/* Content Render Area */}
      {loading && tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">{UI_LABELS.TASK.LOADING_TASKS}</p>
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={handleEditTaskClick} />
          ))}
        </div>
      )}

      {/* Task Creation & Edit Modal */}
      <TaskFormDialog
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        taskIdToEdit={taskIdToEdit}
      />
    </div>
  );
}
