import { z } from "zod";
import { UI_LABELS } from "@/constants";


export const taskSchema = z.object({
  title: z
    .string()
    .min(1, UI_LABELS.TASK.VALIDATION.TITLE_REQUIRED)
    .max(100, UI_LABELS.TASK.VALIDATION.TITLE_MAX),
  description: z
    .string()
    .max(1000, UI_LABELS.TASK.VALIDATION.DESC_MAX)
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["TO_DO", "IN_PROGRESS", "COMPLETED"]),
  dueDate: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
