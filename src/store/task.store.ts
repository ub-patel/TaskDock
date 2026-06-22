import { create } from "zustand";
import { TaskService } from "@/services/task.service";
import type { Task, CreateTaskInput, UpdateTaskInput } from "@/types";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  actions: {
    fetchTasks: () => Promise<void>;
    createTask: (userId: string, input: CreateTaskInput) => Promise<void>;
    updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
  };
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  actions: {
    fetchTasks: async (): Promise<void> => {
      set({ loading: true, error: null });
      try {
        const tasks = await TaskService.getTasks();
        set({ tasks, loading: false });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load tasks.";
        set({ error: message, loading: false });
      }
    },
    createTask: async (userId: string, input: CreateTaskInput): Promise<void> => {
      set({ loading: true, error: null });
      try {
        const newTask = await TaskService.createTask(userId, input);
        set((state) => ({
          tasks: [newTask, ...state.tasks],
          loading: false,
        }));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to create task.";
        set({ error: message, loading: false });
        throw err;
      }
    },
    updateTask: async (id: string, input: UpdateTaskInput): Promise<void> => {
      const previousTasks = get().tasks;
      // Optimistic update
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                title: input.title !== undefined ? input.title : t.title,
                description: input.description !== undefined ? input.description : t.description,
                priority: input.priority !== undefined ? input.priority : t.priority,
                status: input.status !== undefined ? input.status : t.status,
                dueDate: input.dueDate !== undefined ? input.dueDate : t.dueDate,
              }
            : t
        ),
      }));

      try {
        await TaskService.updateTask(id, input);
      } catch (err: unknown) {
        // Rollback
        const message = err instanceof Error ? err.message : "Failed to update task.";
        set({ tasks: previousTasks, error: message });
        throw err;
      }
    },
    deleteTask: async (id: string): Promise<void> => {
      const previousTasks = get().tasks;
      // Optimistic delete
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));

      try {
        await TaskService.deleteTask(id);
      } catch (err: unknown) {
        // Rollback
        const message = err instanceof Error ? err.message : "Failed to delete task.";
        set({ tasks: previousTasks, error: message });
        throw err;
      }
    },
  },
}));

// Export hooks for selectors with explicit return types
export const useTasks = (): Task[] => useTaskStore((state) => state.tasks);
export const useTasksLoading = (): boolean => useTaskStore((state) => state.loading);
export const useTasksError = (): string | null => useTaskStore((state) => state.error);
export const useTaskActions = (): TaskState["actions"] => useTaskStore((state) => state.actions);
