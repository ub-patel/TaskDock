import type { ReactNode } from "react";

export interface ChildrenProps {
  children: ReactNode;
}

export interface AuthInput {
  email: string;
  password: string;
  fullName?: string;
}

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
}

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "COMPLETED";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  createdAt: string;
}

export type CreateTaskInput = Omit<Task, "id" | "userId" | "createdAt">;
export type UpdateTaskInput = Partial<CreateTaskInput>;
export type ToastType = "error" | "success" | "info" | "warning";

