import React from 'react'

export default function Table({ columns, rows }: { columns: string[]; rows: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="text-slate-400">
            {columns.map((c) => (
              <th key={c} className="text-left py-2 pr-4">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-800">
              {columns.map((c, j) => (
                <td key={j} className="py-3 pr-4 align-top text-slate-200">{r[c] ?? ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
