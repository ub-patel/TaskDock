import { z } from "zod";
import { UI_LABELS } from "@/constants";


export const loginSchema = z.object({
  email: z
    .string()
    .min(1, UI_LABELS.AUTH.VALIDATION.EMAIL_REQUIRED)
    .email(UI_LABELS.AUTH.VALIDATION.EMAIL_INVALID),
  password: z.string().min(6, UI_LABELS.AUTH.VALIDATION.PASSWORD_MIN),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, UI_LABELS.AUTH.VALIDATION.NAME_MIN),
  email: z
    .string()
    .min(1, UI_LABELS.AUTH.VALIDATION.EMAIL_REQUIRED)
    .email(UI_LABELS.AUTH.VALIDATION.EMAIL_INVALID),
  password: z.string().min(6, UI_LABELS.AUTH.VALIDATION.PASSWORD_MIN),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
