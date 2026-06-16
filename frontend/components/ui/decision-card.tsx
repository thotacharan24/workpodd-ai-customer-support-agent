"use client";

import { motion } from "framer-motion";
import { Check, X, AlertCircle } from "lucide-react";

interface DecisionCardProps {
  decision: "approved" | "denied" | "escalated";
  reason: string;
  policyApplied?: string[];
  confidence?: number;
  timestamp?: string;
  className?: string;
}

const decisionStyles = {
  approved: {
    icon: Check,
    colors: "bg-emerald-500/10 border-emerald-500/30",
    textColor: "text-emerald-400",
    badgeColor: "bg-emerald-500/20 text-emerald-300",
  },
  denied: {
    icon: X,
    colors: "bg-red-500/10 border-red-500/30",
    textColor: "text-red-400",
    badgeColor: "bg-red-500/20 text-red-300",
  },
  escalated: {
    icon: AlertCircle,
    colors: "bg-amber-500/10 border-amber-500/30",
    textColor: "text-amber-400",
    badgeColor: "bg-amber-500/20 text-amber-300",
  },
};

export function DecisionCard({
  decision,
  reason,
  policyApplied = [],
  confidence = 0,
  timestamp,
  className = "",
}: DecisionCardProps) {
  const style = decisionStyles[decision];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`glass-card overflow-hidden ${style.colors} p-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className={`rounded-lg bg-white/10 p-3 ${style.textColor}`}>
          <Icon size={24} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold capitalize ${style.textColor}`}>
              {decision}
            </h3>
            {confidence > 0 && (
              <span className={`${style.badgeColor} px-3 py-1 rounded-full text-sm font-medium`}>
                {confidence}% confidence
              </span>
            )}
          </div>

          <p className="mt-2 text-slate-200">{reason}</p>

          {policyApplied.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-slate-400 mb-2">Policy Rules Applied:</p>
              <div className="flex flex-wrap gap-2">
                {policyApplied.map((policy, idx) => (
                  <span
                    key={idx}
                    className={`${style.badgeColor} px-2 py-1 rounded text-xs font-medium`}
                  >
                    {policy}
                  </span>
                ))}
              </div>
            </div>
          )}

          {timestamp && (
            <p className="mt-4 text-xs text-slate-500">
              {new Date(timestamp).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
