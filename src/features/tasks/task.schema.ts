import { z } from "zod";
import { UI_LABELS } from "@/constants";
import { checkForMischief } from "@/utils";
import { useUiStore } from "@/store/ui.store";

const refineMischief = (val: string) => {
  const check = checkForMischief(val);
  if (check.hasMischief) {
    setTimeout(() => {
      useUiStore.getState().actions.showToast(check.reason || UI_LABELS.SECURITY.INJECTION_DETECTED, "error");
    }, 0);
    return false;
  }
  return true;
};

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, UI_LABELS.TASK.VALIDATION.TITLE_REQUIRED)
    .max(100, UI_LABELS.TASK.VALIDATION.TITLE_MAX)
    .refine(refineMischief, {
      message: UI_LABELS.SECURITY.INJECTION_DETECTED,
    }),
  description: z
    .string()
    .max(1000, UI_LABELS.TASK.VALIDATION.DESC_MAX)
    .optional()
    .refine((val) => !val || refineMischief(val), {
      message: UI_LABELS.SECURITY.INJECTION_DETECTED,
    }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["TO_DO", "IN_PROGRESS", "COMPLETED"]),
  dueDate: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;


