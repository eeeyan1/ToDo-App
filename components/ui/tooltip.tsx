import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  content: React.ReactNode;
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [content, setContent] = React.useState<React.ReactNode>(null);

  return (
    <TooltipContext.Provider value={{ open, setOpen, content }}>
      {children}
      <TooltipPortal />
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({
  children,
  "aria-label": ariaLabel,
}: {
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  "aria-label"?: string;
}) {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) return children;

  const { setOpen, open } = ctx;

  return React.cloneElement(children, {
    onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
      children.props.onMouseEnter?.(event);
      setOpen(true);
    },
    onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
      children.props.onMouseLeave?.(event);
      setOpen(false);
    },
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      children.props.onFocus?.(event);
      setOpen(true);
    },
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      children.props.onBlur?.(event);
      setOpen(false);
    },
    "aria-label": ariaLabel ?? children.props["aria-label"],
    "data-tooltip-open": open ? "true" : undefined,
  } as React.HTMLAttributes<HTMLElement>);
}

export function TooltipContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(TooltipContext);
  const [mounted, setMounted] = React.useState(false);
  const [coords, setCoords] = React.useState<{ x: number; y: number } | null>(
    null,
  );

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!ctx?.open) return;

    const handleMove = (event: MouseEvent) => {
      setCoords({ x: event.clientX, y: event.clientY + 16 });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [ctx?.open]);

  if (!ctx || !ctx.open || !mounted || !coords) return null;

  return createPortal(
    <div
      className={cn(
        "pointer-events-none fixed z-50 rounded-md bg-zinc-900 px-2 py-1 text-xs text-zinc-50 shadow-lg",
        className,
      )}
      style={{ top: coords.y, left: coords.x }}
      role="tooltip"
    >
      {children}
    </div>,
    document.body,
  );
}

function TooltipPortal() {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) return null;
  return null;
}

