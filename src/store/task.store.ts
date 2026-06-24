import { create } from "zustand";
import { TaskService } from "@/services";
import type { Task, CreateTaskInput, UpdateTaskInput } from "@/types";
import { UI_LABELS } from "@/constants";
import { useUiStore } from "@/store/ui.store";



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
        const message = err instanceof Error ? err.message : UI_LABELS.TASK.ERROR.LOAD;
        set({ error: message, loading: false });
        useUiStore.getState().actions.showToast(message, "error");
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
        useUiStore.getState().actions.showToast("Task created successfully", "success");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : UI_LABELS.TASK.ERROR.CREATE;
        set({ error: message, loading: false });
        useUiStore.getState().actions.showToast(message, "error");
        throw err;
      }
    },
    updateTask: async (id: string, input: UpdateTaskInput): Promise<void> => {
      const previousTasks = get().tasks;
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
        useUiStore.getState().actions.showToast("Changes saved successfully", "success");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : UI_LABELS.TASK.ERROR.UPDATE;
        set({ tasks: previousTasks, error: message });
        useUiStore.getState().actions.showToast(message, "error");
        throw err;
      }
    },
    deleteTask: async (id: string): Promise<void> => {
      const previousTasks = get().tasks;
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));

      try {
        await TaskService.deleteTask(id);
        useUiStore.getState().actions.showToast("Task deleted successfully", "success");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : UI_LABELS.TASK.ERROR.DELETE;
        set({ tasks: previousTasks, error: message });
        useUiStore.getState().actions.showToast(message, "error");
        throw err;
      }
    },
  },
}));

export const useTasks = (): Task[] => useTaskStore((state) => state.tasks);
export const useTasksLoading = (): boolean => useTaskStore((state) => state.loading);
export const useTasksError = (): string | null => useTaskStore((state) => state.error);
export const useTaskActions = (): TaskState["actions"] => useTaskStore((state) => state.actions);
