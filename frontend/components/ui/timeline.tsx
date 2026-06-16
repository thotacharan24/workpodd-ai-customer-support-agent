"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

interface TimelineStep {
  id: string;
  label: string;
  status: "pending" | "completed" | "error";
  detail?: string;
  latency?: number;
}

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function Timeline({ steps, className = "" }: TimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`glass-card p-6 ${className}`}
    >
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex gap-4"
          >
            {/* Timeline node */}
            <div className="flex flex-col items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.1 }}
                className={`rounded-full p-2 ${
                  step.status === "completed"
                    ? "bg-emerald-500/20"
                    : step.status === "error"
                    ? "bg-red-500/20"
                    : "bg-slate-700/30"
                }`}
              >
                {step.status === "completed" ? (
                  <Check
                    size={20}
                    className="text-emerald-400"
                  />
                ) : step.status === "error" ? (
                  <div className="w-5 h-5 text-red-400">✕</div>
                ) : (
                  <Loader2 size={20} className="text-slate-400 animate-spin" />
                )}
              </motion.div>

              {index < steps.length - 1 && (
                <div className="h-8 w-0.5 bg-gradient-to-b from-slate-600 to-slate-700" />
              )}
            </div>

            {/* Timeline content */}
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white">{step.label}</p>
                {step.latency && (
                  <span className="text-xs text-slate-400">
                    {step.latency}ms
                  </span>
                )}
              </div>
              {step.detail && (
                <p className="mt-1 text-sm text-slate-400">{step.detail}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
