"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Settings, History, Sigma } from "lucide-react";
import { cn } from "@/utils/cn";

export function BottomNav({ isDesktop = false }: { isDesktop?: boolean }) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Calculator },
    { href: "/formulas", label: "Formula", icon: Sigma },
    { href: "/history", label: "History", icon: History },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  if (isDesktop) {
    return (
      <nav className="flex flex-col space-y-2">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-cyan-500/10 text-cyan-400 font-medium" 
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-cyan-500/20")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm">{label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
      <ul className="flex items-center justify-around h-16">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-cyan-500" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "fill-cyan-500/20")} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
