"use client";

import * as React from "react";
import { DEFAULT_CATEGORIES, type TodoCategory } from "@/types/todo";
import { cn } from "@/lib/utils";

interface SidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  categoryCounts: Record<string, number>;
  totalCount: number;
  todayCount: number;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  totalCount,
  todayCount,
  isOpen,
  onToggle,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform border-r border-zinc-200 bg-white/80 backdrop-blur-md transition-transform duration-300 dark:border-white/10 dark:bg-black/40 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col p-4">
          <nav className="flex-1 space-y-1">
            {/* Today view */}
            <button
              onClick={() => onSelectCategory(null)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                selectedCategory === null
                  ? "bg-zinc-200 text-zinc-900 dark:bg-white/15 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
              )}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-amber-400 to-orange-500 text-xs">
                📅
              </span>
              <span className="flex-1">Today</span>
              <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:bg-white/10 dark:text-zinc-400">
                {todayCount}
              </span>
            </button>

            {/* All tasks */}
            <button
              onClick={() => onSelectCategory("all")}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                selectedCategory === "all"
                  ? "bg-zinc-200 text-zinc-900 dark:bg-white/15 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
              )}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-zinc-500 to-zinc-600 text-xs">
                📋
              </span>
              <span className="flex-1">All Tasks</span>
              <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:bg-white/10 dark:text-zinc-400">
                {totalCount}
              </span>
            </button>

            <div className="py-3">
              <div className="border-t border-zinc-200 dark:border-white/10" />
            </div>

            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Categories
            </p>

            {/* Categories */}
            {DEFAULT_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  selectedCategory === category.id
                    ? "bg-zinc-200 text-zinc-900 dark:bg-white/15 dark:text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-md text-xs",
                    category.color
                  )}
                >
                  {category.icon}
                </span>
                <span className="flex-1">{category.name}</span>
                <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:bg-white/10 dark:text-zinc-400">
                  {categoryCounts[category.id] || 0}
                </span>
              </button>
            ))}
          </nav>

          <div className="border-t border-zinc-200 pt-4 dark:border-white/10">
            <p className="text-center text-xs text-zinc-500">
              {totalCount} tasks total
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
