import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { taskSchema, type TaskFormValues } from "../task.schema";
import { useTaskActions, useTasks } from "@/store/task.store";
import { useAuthUser } from "@/store/auth.store";
import { UI_LABELS } from "@/constants/ui.constants";

interface TaskFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taskIdToEdit?: string | null;
}

export function TaskFormDialog({
  isOpen,
  onClose,
  taskIdToEdit,
}: TaskFormDialogProps): React.JSX.Element | null {
  const user = useAuthUser();
  const tasks = useTasks();
  const { createTask, updateTask } = useTaskActions();

  const isEditMode = !!taskIdToEdit;
  const taskToEdit = tasks.find((t) => t.id === taskIdToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "TO_DO",
      dueDate: "",
    },
  });

  // Reset form when modal opens or task changes
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && taskToEdit) {
        reset({
          title: taskToEdit.title,
          description: taskToEdit.description || "",
          priority: taskToEdit.priority,
          status: taskToEdit.status,
          dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.substring(0, 10) : "",
        });
      } else {
        reset({
          title: "",
          description: "",
          priority: "MEDIUM",
          status: "TO_DO",
          dueDate: "",
        });
      }
    }
  }, [isOpen, isEditMode, taskToEdit, reset]);

  if (!isOpen) return null;

  const onSubmit = async (values: TaskFormValues): Promise<void> => {
    try {
      if (isEditMode && taskIdToEdit) {
        await updateTask(taskIdToEdit, values);
      } else if (user) {
        await createTask(user.id, values);
      }
      onClose();
    } catch (err) {
      console.error("Task submission error", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Content Card */}
      <div className="relative w-full max-w-lg bg-zinc-900 border border-border rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-border/80 bg-zinc-900/50">
          <h3 className="font-bold text-lg text-white">
            {isEditMode ? UI_LABELS.TASK.FORM.EDIT_TITLE : UI_LABELS.TASK.FORM.CREATE_TITLE}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-secondary/40 text-muted-foreground hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="task-title">
              {UI_LABELS.TASK.FORM.LABEL_TITLE}
            </label>
            <input
              id="task-title"
              placeholder={UI_LABELS.TASK.FORM.PLACEHOLDER_TITLE}
              className="w-full px-4 py-2 bg-secondary/20 border border-border focus:border-primary rounded-md outline-none text-sm transition text-white"
              {...register("title")}
            />
            {errors.title && (
              <span className="text-xs text-rose-500">{errors.title.message}</span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="task-desc">
              {UI_LABELS.TASK.FORM.LABEL_DESC}
            </label>
            <textarea
              id="task-desc"
              rows={3}
              placeholder={UI_LABELS.TASK.FORM.PLACEHOLDER_DESC}
              className="w-full px-4 py-2 bg-secondary/20 border border-border focus:border-primary rounded-md outline-none text-sm transition text-white resize-none"
              {...register("description")}
            />
            {errors.description && (
              <span className="text-xs text-rose-500">{errors.description.message}</span>
            )}
          </div>

          {/* Grid fields: Priority, Status, DueDate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="task-priority">
                {UI_LABELS.TASK.FORM.LABEL_PRIORITY}
              </label>
              <select
                id="task-priority"
                className="w-full px-4 py-2 bg-secondary/25 border border-border focus:border-primary rounded-md outline-none text-sm transition text-white"
                {...register("priority")}
              >
                <option value="LOW" className="bg-zinc-900">{UI_LABELS.TASK.PRIORITY.LOW}</option>
                <option value="MEDIUM" className="bg-zinc-900">{UI_LABELS.TASK.PRIORITY.MEDIUM}</option>
                <option value="HIGH" className="bg-zinc-900">{UI_LABELS.TASK.PRIORITY.HIGH}</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="task-status">
                {UI_LABELS.TASK.FORM.LABEL_STATUS}
              </label>
              <select
                id="task-status"
                className="w-full px-4 py-2 bg-secondary/25 border border-border focus:border-primary rounded-md outline-none text-sm transition text-white"
                {...register("status")}
              >
                <option value="TO_DO" className="bg-zinc-900">{UI_LABELS.TASK.STATUS.TO_DO}</option>
                <option value="IN_PROGRESS" className="bg-zinc-900">{UI_LABELS.TASK.STATUS.IN_PROGRESS}</option>
                <option value="COMPLETED" className="bg-zinc-900">{UI_LABELS.TASK.STATUS.COMPLETED}</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="task-due-date">
              {UI_LABELS.TASK.FORM.LABEL_DUE_DATE}
            </label>
            <input
              id="task-due-date"
              type="date"
              className="w-full px-4 py-2 bg-secondary/20 border border-border focus:border-primary rounded-md outline-none text-sm transition text-white"
              {...register("dueDate")}
            />
            {errors.dueDate && (
              <span className="text-xs text-rose-500">{errors.dueDate.message}</span>
            )}
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-border text-sm font-medium hover:bg-secondary/40 text-muted-foreground hover:text-white transition"
            >
              {UI_LABELS.TASK.FORM.CANCEL}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/95 transition disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              ) : isEditMode ? (
                UI_LABELS.TASK.FORM.SUBMIT_SAVE
              ) : (
                UI_LABELS.TASK.FORM.SUBMIT_CREATE
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
