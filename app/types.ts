export type Priority = "high" | "medium" | "low";

export type Filter = "all" | "pending" | "done";

export interface Todo {
  id: string;
  title: string;
  priority: Priority;
  done: boolean;
  createdAt: number;
}
