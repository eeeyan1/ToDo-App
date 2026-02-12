import { useEffect, useMemo, useState } from "react";
import type { Todo, TodoFilter } from "@/types/todo";

const STORAGE_KEY = "todo-app:todos";

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
    }));
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>("all");

  useEffect(() => {
    setTodos(loadInitialTodos());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const addTodo = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updateTodoTitle = (id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, title: trimmed } : todo)),
    );
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const activeCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos],
  );

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos],
  );

  return {
    todos,
    filteredTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    removeTodo,
    updateTodoTitle,
    clearCompleted,
    activeCount,
    completedCount,
  };
}

