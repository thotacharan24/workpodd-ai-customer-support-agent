import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Zap } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

const links: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Customer Chat", href: "/chat" },
  { label: "Admin Dashboard", href: "/dashboard" },
];

export function TopNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 glass-card p-6 sticky top-0 z-50 backdrop-blur-xl"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition"></div>
            <div className="relative bg-slate-950 rounded-lg p-2">
              <Zap size={24} className="text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
              WorkPodd AI
            </p>
            <h1 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
              Refund Agent
            </h1>
          </div>
        </Link>

        <nav className="flex flex-wrap gap-2">
          {links.map((link, idx) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                href={link.href}
                className={clsx(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                  "text-slate-300 hover:text-white",
                  "hover:bg-slate-800/50 border border-slate-700/50",
                  "group overflow-hidden"
                )}
              >
                <span className="relative z-10">{link.label}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-emerald-600/0 group-hover:from-blue-600/10 group-hover:to-emerald-600/10 transition-all" />
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
