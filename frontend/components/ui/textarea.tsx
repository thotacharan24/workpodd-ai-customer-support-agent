import { TextareaHTMLAttributes } from "react";
import clsx from "clsx";

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "w-full min-h-[140px] rounded-2xl border border-slate-800/70 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20",
        props.className,
      )}
      {...props}
    />
  );
}
