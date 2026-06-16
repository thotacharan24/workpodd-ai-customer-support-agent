"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  variant?: "primary" | "success" | "danger" | "warning";
  className?: string;
}

const variantStyles = {
  primary: "from-blue-500/10 to-blue-400/5 border-blue-500/20",
  success: "from-emerald-500/10 to-emerald-400/5 border-emerald-500/20",
  danger: "from-red-500/10 to-red-400/5 border-red-500/20",
  warning: "from-amber-500/10 to-amber-400/5 border-amber-500/20",
};

const iconColorStyles = {
  primary: "text-blue-400",
  success: "text-emerald-400",
  danger: "text-red-400",
  warning: "text-amber-400",
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  variant = "primary",
  className = "",
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-card relative overflow-hidden p-6 ${variantStyles[variant]} ${className}`}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="label">{label}</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-4xl font-bold text-white"
          >
            {value}
          </motion.p>

          {trend && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`mt-2 text-sm font-medium ${
                trend.isPositive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </motion.div>
          )}
        </div>

        {Icon && (
          <div
            className={`rounded-lg bg-white/5 p-3 ${iconColorStyles[variant]}`}
          >
            <Icon size={24} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
