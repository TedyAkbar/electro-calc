import React from "react";
import { cn } from "@/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glass?: boolean;
}

export function Card({ children, className, glass = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 shadow-lg",
        glass ? "glass" : "bg-white dark:bg-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
