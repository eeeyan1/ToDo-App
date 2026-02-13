"use client";

import * as React from "react";
import { DEFAULT_CATEGORIES, type TodoCategory } from "@/types/todo";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  value: string | null;
  onChange: (categoryId: string | null) => void;
  compact?: boolean;
}

export function CategorySelector({ value, onChange, compact = false }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCategory = DEFAULT_CATEGORIES.find((c) => c.id === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700",
          compact && "px-2 py-1.5"
        )}
      >
        {selectedCategory ? (
          <>
            <span>{selectedCategory.icon}</span>
            {!compact && <span className="text-zinc-700 dark:text-zinc-200">{selectedCategory.name}</span>}
          </>
        ) : (
          <>
            <span className="text-zinc-400">📁</span>
            {!compact && <span className="text-zinc-500">Category</span>}
          </>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={cn("h-4 w-4 text-zinc-400 transition-transform", isOpen && "rotate-180")}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setIsOpen(false);
            }}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700",
              value === null && "bg-zinc-100 dark:bg-zinc-700"
            )}
          >
            <span>📁</span>
            <span className="text-zinc-600 dark:text-zinc-300">No Category</span>
          </button>
          {DEFAULT_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                onChange(category.id);
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700",
                value === category.id && "bg-zinc-100 dark:bg-zinc-700"
              )}
            >
              <span>{category.icon}</span>
              <span className="text-zinc-700 dark:text-zinc-200">{category.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
