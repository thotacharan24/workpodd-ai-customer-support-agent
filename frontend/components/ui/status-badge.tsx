"use client";

interface StatusBadgeProps {
  status: "success" | "danger" | "warning" | "info" | "pending";
  label: string;
  className?: string;
}

const statusStyles = {
  success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  danger: "bg-red-500/20 text-red-300 border-red-500/30",
  warning: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  info: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  pending: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

export function StatusBadge({
  status,
  label,
  className = "",
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-all ${
        statusStyles[status]
      } ${className}`}
    >
      <span className="mr-2 h-2 w-2 rounded-full bg-current" />
      {label}
    </span>
  );
}
