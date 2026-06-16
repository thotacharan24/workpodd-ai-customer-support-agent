import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className, children }: CardProps) {
  return <div className={clsx("card", className)}>{children}</div>;
}
