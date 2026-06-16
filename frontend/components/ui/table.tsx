import { ReactNode } from "react";
import clsx from "clsx";

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

export function Table({ headers, children, className }: TableProps) {
  return (
    <div className={clsx("overflow-x-auto rounded-3xl border border-slate-800/75 bg-slate-950/80 shadow-card", className)}>
      <table className="min-w-full border-collapse text-left text-sm text-slate-300">
        <thead className="bg-slate-950/90 text-slate-400">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium uppercase tracking-[0.16em] text-slate-400">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
