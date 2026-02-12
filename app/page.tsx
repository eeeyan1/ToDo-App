"use client";

import { useState } from "react";
import { useTodos } from "@/hooks/use-todos";
import type { TodoFilter } from "@/types/todo";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TodoList } from "@/components/todo/todo-list";

export default function Home() {
  const {
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
  } = useTodos();

  const [newTodo, setNewTodo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    addTodo(newTodo);
    setNewTodo("");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 font-sans text-zinc-900 dark:text-zinc-50">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center blur-sm"
        style={{ backgroundImage: 'url("/todo.jpg")' }}
        aria-hidden="true"
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      <div className="relative w-full max-w-2xl space-y-6">
        <header className="space-y-2 text-center sm:text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
            To Do App
          </h1>
          <p className="text-sm text-zinc-200">
            Capture what you need to do, mark things as done, and pick up right
            where you left off.
          </p>
        </header>

        <Card className="space-y-4 border-white/20 bg-white/60 shadow-xl shadow-black/30 backdrop-blur-xl dark:border-white/15 dark:bg-black/40">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Input
              placeholder="Add a new to-do and press Enter…"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              aria-label="New to-do"
            />
            <Button type="submit" className="shrink-0 sm:w-28">
              Add
            </Button>
          </form>

          <TodoList
            todos={filteredTodos}
            filter={filter as TodoFilter}
            activeCount={activeCount}
            completedCount={completedCount}
            onFilterChange={(f) => setFilter(f)}
            onToggleTodo={toggleTodo}
            onDeleteTodo={removeTodo}
            onUpdateTodoTitle={updateTodoTitle}
            onClearCompleted={clearCompleted}
          />
        </Card>
      </div>
    </div>
  );
}
