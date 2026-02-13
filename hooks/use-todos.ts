import { useEffect, useMemo, useState, useCallback } from "react";
import type { Todo, TodoFilter } from "@/types/todo";

const STORAGE_KEY = "todo-app:todos";

// Get today's date in YYYY-MM-DD format
export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function loadInitialTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Todo[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((t) => ({
      ...t,
      createdAt: t.createdAt ?? new Date().toISOString(),
      scheduledDate: t.scheduledDate ?? getTodayDateString(),
      categoryId: t.categoryId ?? null,
    }));
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>("active");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setTodos(loadInitialTodos());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const todayDateString = getTodayDateString();

  // Filter todos based on selected category, date (if "Today" view), and search
  const filteredTodos = useMemo(() => {
    let result = todos;

    // Category/View filtering
    if (selectedCategory === null) {
      // "Today" view - only show tasks scheduled for today
      result = result.filter((t) => t.scheduledDate === todayDateString);
    } else if (selectedCategory !== "all") {
      // Specific category selected
      result = result.filter((t) => t.categoryId === selectedCategory);
    }
    // If selectedCategory === "all", show all tasks

    // Search filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((t) => t.title.toLowerCase().includes(query));
    }

    // Status filtering (active/completed/all)
    switch (filter) {
      case "active":
        return result.filter((t) => !t.completed);
      case "completed":
        return result.filter((t) => t.completed);
      default:
        return result;
    }
  }, [todos, filter, selectedCategory, searchQuery, todayDateString]);

  const addTodo = useCallback((title: string, categoryId: string | null = null) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
      scheduledDate: getTodayDateString(),
      categoryId: categoryId,
    };
    setTodos((prev) => [newTodo, ...prev]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }, []);

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const updateTodoTitle = useCallback((id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, title: trimmed } : todo)),
    );
  }, []);

  const updateTodoCategory = useCallback((id: string, categoryId: string | null) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, categoryId } : todo)),
    );
  }, []);

  const updateTodoDate = useCallback((id: string, scheduledDate: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, scheduledDate } : todo)),
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, []);

  // Count all active todos
  const activeCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos],
  );

  // Count all completed todos
  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos],
  );

  // Count todos for today
  const todayCount = useMemo(
    () => todos.filter((t) => t.scheduledDate === todayDateString && !t.completed).length,
    [todos, todayDateString],
  );

  // Count todos by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    todos.forEach((t) => {
      if (t.categoryId && !t.completed) {
        counts[t.categoryId] = (counts[t.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [todos]);

  // Get view-specific counts (for the currently selected view)
  const viewActiveCount = useMemo(() => {
    let result = todos;
    if (selectedCategory === null) {
      result = result.filter((t) => t.scheduledDate === todayDateString);
    } else if (selectedCategory !== "all") {
      result = result.filter((t) => t.categoryId === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((t) => t.title.toLowerCase().includes(query));
    }
    return result.filter((t) => !t.completed).length;
  }, [todos, selectedCategory, searchQuery, todayDateString]);

  const viewCompletedCount = useMemo(() => {
    let result = todos;
    if (selectedCategory === null) {
      result = result.filter((t) => t.scheduledDate === todayDateString);
    } else if (selectedCategory !== "all") {
      result = result.filter((t) => t.categoryId === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((t) => t.title.toLowerCase().includes(query));
    }
    return result.filter((t) => t.completed).length;
  }, [todos, selectedCategory, searchQuery, todayDateString]);

  return {
    todos,
    filteredTodos,
    filter,
    setFilter,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    addTodo,
    toggleTodo,
    removeTodo,
    updateTodoTitle,
    updateTodoCategory,
    updateTodoDate,
    clearCompleted,
    activeCount,
    completedCount,
    todayCount,
    categoryCounts,
    viewActiveCount,
    viewCompletedCount,
  };
}


