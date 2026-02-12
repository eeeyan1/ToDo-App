import type { Todo, TodoFilter } from "@/types/todo";
import { TodoItem } from "@/components/todo/todo-item";
import { Button } from "@/components/ui/button";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";

interface TodoListProps {
  todos: Todo[];
  filter: TodoFilter;
  activeCount: number;
  completedCount: number;
  onFilterChange: (filter: TodoFilter) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodoTitle: (id: string, title: string) => void;
  onClearCompleted: () => void;
}

export function TodoList({
  todos,
  filter,
  activeCount,
  completedCount,
  onFilterChange,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodoTitle,
  onClearCompleted,
}: TodoListProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(val) => onFilterChange(val as TodoFilter)}>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </Tabs>

        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span>
            {activeCount} active / {completedCount} completed
          </span>
          {completedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearCompleted}
              className="px-0 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              Clear completed
            </Button>
          )}
        </div>
      </div>

      {todos.length === 0 ? (
        <p className="rounded-md border border-dashed border-zinc-200 bg-zinc-50 p-4 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40">
          No to-dos here yet. Add something you want to get done.
        </p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => onToggleTodo(todo.id)}
              onDelete={() => onDeleteTodo(todo.id)}
              onUpdateTitle={(title) => onUpdateTodoTitle(todo.id, title)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

