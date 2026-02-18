"use client";

import { useState } from "react";
import { useTodos, getTodayDateString } from "@/hooks/use-todos";
import { useUser } from "@/contexts/user-context";
import type { TodoFilter, DEFAULT_CATEGORIES } from "@/types/todo";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TodoList } from "@/components/todo/todo-list";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { EditProfileModal } from "@/components/layout/edit-profile-modal";
import { SearchBar } from "@/components/ui/search-bar";
import { CategorySelector } from "@/components/ui/category-selector";

export default function Home() {
  const { isAuthenticated, isLoading } = useUser();
  const {
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
    clearCompleted,
    activeCount,
    todayCount,
    categoryCounts,
    viewActiveCount,
    viewCompletedCount,
  } = useTodos();

  const [newTodo, setNewTodo] = useState("");
  const [newTodoCategory, setNewTodoCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    // Use selected sidebar category if no specific category chosen, but only if it's a real category
    const categoryToUse = newTodoCategory ?? (selectedCategory && selectedCategory !== "all" ? selectedCategory : null);
    addTodo(newTodo, categoryToUse);
    setNewTodo("");
    setNewTodoCategory(null);
  };

  // Get view title based on selected category
  const getViewTitle = () => {
    if (selectedCategory === null) {
      const today = new Date();
      return `Today - ${today.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}`;
    }
    if (selectedCategory === "all") return "All Tasks";
    const categories = [
      { id: "personal", name: "Personal" },
      { id: "work", name: "Work" },
      { id: "shopping", name: "Shopping" },
      { id: "health", name: "Health" },
      { id: "learning", name: "Learning" },
    ];
    const category = categories.find((c) => c.id === selectedCategory);
    return category?.name || "Tasks";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-white/20 dark:border-t-white" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
        <div
          className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center blur-sm"
          style={{ backgroundImage: 'url("/todo.jpg")' }}
          aria-hidden="true"
        />
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        <Card className="w-full max-w-md space-y-6 border-white/20 bg-white/60 p-8 shadow-xl backdrop-blur-xl dark:border-white/15 dark:bg-black/40">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Welcome to To Do App</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Please sign in to continue</p>
          </div>
          <Button
            onClick={() => {
              // Auto-login with demo user
              window.location.reload();
            }}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
          >
            Get Started
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-zinc-900 dark:text-zinc-50">
      {/* Background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center blur-sm"
        style={{ backgroundImage: 'url("/todo.jpg")' }}
        aria-hidden="true"
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      {/* Header */}
      <Header onEditProfile={() => setEditProfileOpen(true)} />

      {/* Sidebar */}
      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
        totalCount={activeCount}
        todayCount={todayCount}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-20 z-20 rounded-lg bg-white/80 p-2 text-zinc-700 shadow-md backdrop-blur-md transition-colors hover:bg-white dark:bg-black/40 dark:text-white dark:hover:bg-black/60 lg:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Main Content */}
      <main className="pt-16 lg:pl-80">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          {/* View Header */}
          <header className="mb-6 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                {getViewTitle()}
              </h1>
            </div>
            <p className="text-sm text-white/80">
              {selectedCategory === null
                ? "Tasks scheduled for today. Past uncompleted tasks won't appear here."
                : selectedCategory === "all"
                ? "All your tasks across all categories and dates."
                : "Tasks in this category."}
            </p>
          </header>

          <div className="mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tasks"
            />
          </div>

          {/* Main Card */}
          <Card className="space-y-4 border-white/20 bg-white/60 shadow-xl shadow-black/30 backdrop-blur-xl dark:border-white/15 dark:bg-black/40">
            {/* Add Todo Form - hidden in "All Tasks" view */}
            {selectedCategory !== "all" && (
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  Name your To-do for the day.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex flex-1 gap-2">
                    <CategorySelector
                      value={newTodoCategory}
                      onChange={setNewTodoCategory}
                      compact
                    />
                    <Input
                      placeholder="Add a new to-do and press Enter…"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      aria-label="New to-do"
                      className="flex-1"
                    />
                  </div>
                  <Button type="submit" className="shrink-0 sm:w-28">
                    Add
                  </Button>
                </div>
              </form>
            )}

            {/* Todo List */}
            <TodoList
              todos={filteredTodos}
              filter={filter as TodoFilter}
              activeCount={viewActiveCount}
              completedCount={viewCompletedCount}
              onFilterChange={(f) => setFilter(f)}
              onToggleTodo={toggleTodo}
              onDeleteTodo={removeTodo}
              onUpdateTodoTitle={updateTodoTitle}
              onClearCompleted={clearCompleted}
            />
          </Card>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />
    </div>
  );
}
