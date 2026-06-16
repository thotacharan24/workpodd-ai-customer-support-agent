import { ReactNode } from "react";
import clsx from "clsx";

interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "info";
  children: ReactNode;
}

export function Badge({ variant = "info", children }: BadgeProps) {
  const classes = clsx(
    "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
    variant === "success" && "bg-emerald-500/15 text-emerald-300",
    variant === "warning" && "bg-amber-500/10 text-amber-300",
    variant === "danger" && "bg-rose-500/10 text-rose-300",
    variant === "info" && "bg-sky-500/10 text-sky-300",
  );
  return <span className={classes}>{children}</span>;
}
