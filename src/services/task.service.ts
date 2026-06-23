import { supabase } from "@/lib/supabase-client";
import type { Task, CreateTaskInput, UpdateTaskInput } from "@/types";

interface DbTask {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  priority: Task["priority"];
  status: Task["status"];
  due_date: string | null;
  created_at: string;
}

export class TaskService {
  static async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const dbTasks = (data || []) as DbTask[];

    return dbTasks.map((task) => ({
      id: task.id,
      userId: task.user_id,
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      status: task.status,
      dueDate: task.due_date || "",
      createdAt: task.created_at,
    }));
  }

  static async createTask(userId: string, input: CreateTaskInput): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: userId,
        title: input.title,
        description: input.description || "",
        priority: input.priority,
        status: input.status,
        due_date: input.dueDate || null,
      })
      .select()
      .single();

    if (error) throw error;

    const dbTask = data as DbTask;

    return {
      id: dbTask.id,
      userId: dbTask.user_id,
      title: dbTask.title,
      description: dbTask.description || "",
      priority: dbTask.priority,
      status: dbTask.status,
      dueDate: dbTask.due_date || "",
      createdAt: dbTask.created_at,
    };
  }

  static async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    const updates: Partial<Omit<DbTask, "id" | "user_id" | "created_at">> = {};
    if (input.title !== undefined) updates.title = input.title;
    if (input.description !== undefined) updates.description = input.description;
    if (input.priority !== undefined) updates.priority = input.priority;
    if (input.status !== undefined) updates.status = input.status;
    if (input.dueDate !== undefined) updates.due_date = input.dueDate || null;

    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const dbTask = data as DbTask;

    return {
      id: dbTask.id,
      userId: dbTask.user_id,
      title: dbTask.title,
      description: dbTask.description || "",
      priority: dbTask.priority,
      status: dbTask.status,
      dueDate: dbTask.due_date || "",
      createdAt: dbTask.created_at,
    };
  }

  static async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}
