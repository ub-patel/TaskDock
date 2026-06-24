import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormValues } from "../task.schema";
import { useTaskActions, useTasks, useProfiles } from "@/store/task.store";
import { useAuthUser } from "@/store/auth.store";
import { UI_LABELS } from "@/constants";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, Input, Textarea, Select, Button } from "@/components/shared";


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
  const profiles = useProfiles();
  const { createTask, updateTask, fetchProfiles } = useTaskActions();

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
      assignedUserId: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchProfiles();
      if (isEditMode && taskToEdit) {
        reset({
          title: taskToEdit.title,
          description: taskToEdit.description || "",
          priority: taskToEdit.priority,
          status: taskToEdit.status,
          dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.substring(0, 10) : "",
          assignedUserId: taskToEdit.assignedUserId || "",
        });
      } else {
        reset({
          title: "",
          description: "",
          priority: "MEDIUM",
          status: "TO_DO",
          dueDate: "",
          assignedUserId: user?.id || "",
        });
      }
    }
  }, [isOpen, isEditMode, taskToEdit, reset, fetchProfiles, user]);

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
    <Dialog isOpen={isOpen} onClose={onClose} size="md">
      <DialogHeader onClose={onClose}>
        <DialogTitle>
          {isEditMode ? UI_LABELS.TASK.FORM.EDIT_TITLE : UI_LABELS.TASK.FORM.CREATE_TITLE}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody className="space-y-4">
          <Input
            id="task-title"
            label={UI_LABELS.TASK.FORM.LABEL_TITLE}
            placeholder={UI_LABELS.TASK.FORM.PLACEHOLDER_TITLE}
            error={errors.title?.message}
            {...register("title")}
          />

          <Textarea
            id="task-desc"
            rows={3}
            label={UI_LABELS.TASK.FORM.LABEL_DESC}
            placeholder={UI_LABELS.TASK.FORM.PLACEHOLDER_DESC}
            error={errors.description?.message}
            {...register("description")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="task-priority"
              label={UI_LABELS.TASK.FORM.LABEL_PRIORITY}
              error={errors.priority?.message}
              {...register("priority")}
            >
              <option value="LOW" className="bg-zinc-900">{UI_LABELS.TASK.PRIORITY.LOW}</option>
              <option value="MEDIUM" className="bg-zinc-900">{UI_LABELS.TASK.PRIORITY.MEDIUM}</option>
              <option value="HIGH" className="bg-zinc-900">{UI_LABELS.TASK.PRIORITY.HIGH}</option>
            </Select>

            <Select
              id="task-status"
              label={UI_LABELS.TASK.FORM.LABEL_STATUS}
              error={errors.status?.message}
              {...register("status")}
            >
              <option value="TO_DO" className="bg-zinc-900">{UI_LABELS.TASK.STATUS.TO_DO}</option>
              <option value="IN_PROGRESS" className="bg-zinc-900">{UI_LABELS.TASK.STATUS.IN_PROGRESS}</option>
              <option value="COMPLETED" className="bg-zinc-900">{UI_LABELS.TASK.STATUS.COMPLETED}</option>
            </Select>

            <Select
              id="task-assignee"
              label="Assigned To"
              error={errors.assignedUserId?.message}
              {...register("assignedUserId")}
            >
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id} className="bg-zinc-900">
                  {profile.fullName}
                </option>
              ))}
            </Select>

            <Input
              id="task-due-date"
              type="date"
              label={UI_LABELS.TASK.FORM.LABEL_DUE_DATE}
              error={errors.dueDate?.message}
              {...register("dueDate")}
            />
          </div>
        </DialogBody>

        <DialogFooter className="px-6 pb-6 pt-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            {UI_LABELS.TASK.FORM.CANCEL}
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            {isEditMode ? UI_LABELS.TASK.FORM.SUBMIT_SAVE : UI_LABELS.TASK.FORM.SUBMIT_CREATE}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
