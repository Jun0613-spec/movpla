"use client";

import React from "react";
import { XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import NavItem from "./nav-item";

import { cn } from "@/lib/utils";

interface MobileNavProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const MobileNav = ({ menuOpen, setMenuOpen }: MobileNavProps) => {
  const { theme } = useTheme();

  const pathname = usePathname();

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex transition-all",
        menuOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className="absolute inset-0 bg-black/70 dark:bg-neutral-900/70 transition-opacity"
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={cn(
          "absolute top-0 left-0 h-screen w-1/2 bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center shadow-xl transition-transform transform",
          { "translate-x-0": menuOpen, "-translate-x-full": !menuOpen }
        )}
      >
        <div className="flex items-center justify-between w-full p-6">
          <div className="flex items-center gap-3">
            <Image
              src={
                theme === "light" ? "/images/logo.svg" : "/images/logo-dark.svg"
              }
              alt="Movpla Logo"
              width={36}
              height={36}
            />
            <span className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
              Movpla
            </span>
          </div>

          <Button
            variant="muted"
            size="icon"
            onClick={() => setMenuOpen(false)}
            className="text-neutral-800 dark:text-neutral-100"
          >
            <XIcon className="w-6 h-6" />
          </Button>
        </div>

        <Separator className="w-full border-neutral-200 dark:border-neutral-700" />

        {/* Navigation Links */}
        <div className="flex flex-col items-center justify-start w-full mt-8 px-4 space-y-6">
          <NavItem
            href="/"
            label="Home"
            isActive={pathname === "/"}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
