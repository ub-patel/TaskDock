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

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, UI_LABELS.AUTH.VALIDATION.EMAIL_REQUIRED)
    .email(UI_LABELS.AUTH.VALIDATION.EMAIL_INVALID)
    .refine(refineMischief, {
      message: UI_LABELS.SECURITY.INJECTION_DETECTED,
    }),
  password: z
    .string()
    .min(6, UI_LABELS.AUTH.VALIDATION.PASSWORD_MIN)
    .refine(refineMischief, {
      message: UI_LABELS.SECURITY.INJECTION_DETECTED,
    }),
});

export const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, UI_LABELS.AUTH.VALIDATION.NAME_MIN)
    .refine(refineMischief, {
      message: UI_LABELS.SECURITY.INJECTION_DETECTED,
    }),
  email: z
    .string()
    .min(1, UI_LABELS.AUTH.VALIDATION.EMAIL_REQUIRED)
    .email(UI_LABELS.AUTH.VALIDATION.EMAIL_INVALID)
    .refine(refineMischief, {
      message: UI_LABELS.SECURITY.INJECTION_DETECTED,
    }),
  password: z
    .string()
    .min(6, UI_LABELS.AUTH.VALIDATION.PASSWORD_MIN)
    .refine(refineMischief, {
      message: UI_LABELS.SECURITY.INJECTION_DETECTED,
    }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;


