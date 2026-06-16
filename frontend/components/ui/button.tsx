import { ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition",
        variant === "primary" && "bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-400",
        variant === "secondary" && "border border-slate-700 bg-slate-950/80 text-slate-100 hover:bg-slate-900",
        variant === "ghost" && "bg-transparent text-slate-300 hover:bg-white/5",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
