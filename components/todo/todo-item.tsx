import * as React from "react";
import type { Todo } from "@/types/todo";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onUpdateTitle: (title: string) => void;
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdateTitle,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(todo.title);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    const next = draft.trim();
    if (next && next !== todo.title) {
      onUpdateTitle(next);
    }
    setIsEditing(false);
  };

  const createdDate = new Date(todo.createdAt);

  return (
    <li className="group flex items-start gap-3 rounded-lg border border-zinc-100 bg-zinc-50/80 px-3 py-2 text-sm shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900">
      <div className="mt-1">
        <Checkbox
          checked={todo.completed}
          onChange={onToggle}
          aria-label={todo.completed ? "Mark as active" : "Mark as completed"}
        />
      </div>

      <div className="flex-1 space-y-1">
        {isEditing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") {
                setDraft(todo.title);
                setIsEditing(false);
              }
            }}
            className="w-full rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm text-zinc-900 shadow-sm outline-none ring-0 focus-visible:ring-2 focus-visible:ring-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={cn(
              "block w-full text-left text-sm text-zinc-900 dark:text-zinc-50",
              todo.completed && "line-through text-zinc-400 dark:text-zinc-500",
            )}
          >
            {todo.title}
          </button>
        )}

        <p className="text-xs text-zinc-400">
          Created&nbsp;
          {createdDate.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          &nbsp;at&nbsp;
          {createdDate.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <TooltipProvider>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Tooltip>
            <TooltipTrigger aria-label="Edit to-do">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                ✎
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger aria-label="Delete to-do">
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h2v9H7V9Zm6 0h-2v9h2V9Zm2 0v9h2V9h-2Z"
                    fill="currentColor"
                  />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </li>
  );
}

