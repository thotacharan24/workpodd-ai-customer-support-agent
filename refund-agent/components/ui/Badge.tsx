import React from 'react'

export default function Badge({ children, color = 'bg-slate-700' }: { children: React.ReactNode; color?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-slate-100 ${color}`}>{children}</span>
  )
}
