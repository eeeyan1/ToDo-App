export type TodoFilter = "all" | "active" | "completed";

export interface TodoCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO string
  scheduledDate: string; // ISO date string (YYYY-MM-DD) for daily filtering
  categoryId: string | null; // Reference to category
}

export const DEFAULT_CATEGORIES: TodoCategory[] = [
  { id: "personal", name: "Personal", icon: "👤", color: "bg-blue-500" },
  { id: "work", name: "Work", icon: "💼", color: "bg-purple-500" },
  { id: "shopping", name: "Shopping", icon: "🛒", color: "bg-green-500" },
  { id: "health", name: "Health", icon: "❤️", color: "bg-red-500" },
  { id: "learning", name: "Learning", icon: "📚", color: "bg-yellow-500" },
];

