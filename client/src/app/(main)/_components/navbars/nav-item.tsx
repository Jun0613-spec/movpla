import React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface NavItemProps {
  label: string;
  href: string;
  isActive?: boolean;
  className?: string;
}

const NavItem = ({ label, href, isActive, className }: NavItemProps) => {
  return (
    <Link href={href} className={className}>
      <div
        className={cn(
          "flex items-center px-4 py-2 rounded-lg bg-transparent hover:bg-neutral-800 hover:text-neutral-50 dark:hover:bg-neutral-700 dark:hover:text-neutral-50 transition-all duration-200",
          isActive && "bg-neutral-900 text-neutral-50 dark:bg-neutral-600"
        )}
      >
        <p className="text-sm font-medium">{label}</p>
      </div>
    </Link>
  );
};

export default NavItem;
