"use client";

import { motion } from "framer-motion";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  isLoading?: boolean;
  className?: string;
}

export function ChatBubble({
  message,
  isUser,
  timestamp,
  isLoading = false,
  className = "",
}: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} ${className}`}
    >
      <div
        className={`max-w-xs px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-blue-600/80 text-white rounded-br-none"
            : "glass-card text-slate-100 rounded-bl-none"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-current"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: 0.1,
                }}
                className="h-2 w-2 rounded-full bg-current"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: 0.2,
                }}
                className="h-2 w-2 rounded-full bg-current"
              />
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{message}</p>
        )}
        {timestamp && (
          <p className="mt-1 text-xs opacity-70">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </motion.div>
  );
}
