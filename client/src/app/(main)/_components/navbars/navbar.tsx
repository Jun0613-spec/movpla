"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import ModeToggle from "@/components/mode-toggle";

import { Button } from "@/components/ui/button";

import MobileNav from "./mobile-nav";
import NavItem from "./nav-item";
import UserButton from "./user-button";
import MessageButton from "./messages-button";

import { useAuthStore } from "@/stores/use-auth-store";

const Navbar = () => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuthStore();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const pathname = usePathname();

  return (
    <nav className="h-[100px] flex items-center justify-between px-4">
      {/* Mobile Menu Button */}
      <div className="block sm:hidden">
        <Button variant="muted" onClick={() => setMenuOpen((prev) => !prev)}>
          <MenuIcon className="text-neutral-800 dark:text-neutral-100 !w-6 !h-6" />
        </Button>
        <MobileNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>

      {/* Left section */}
      <section className="flex-1 flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg ">
          <Image
            src={
              theme === "light" ? "/images/logo.svg" : "/images/logo-dark.svg"
            }
            alt="logo"
            width={36}
            height={36}
            className="hover:scale-105"
          />
          <p className="hidden md:block hover:opacity-70">Movpla</p>
        </Link>
        <div className="hidden md:flex  gap-4">
          <NavItem href="/" label="Home" isActive={pathname === "/"} />
          <NavItem
            href="/for-sale"
            label="For sale"
            isActive={pathname === "/for-sale"}
          />
          <NavItem
            href="/to-rent"
            label="To rent"
            isActive={pathname === "/to-rent"}
          />
        </div>
      </section>

      {/* Right section */}
      <section className=" flex items-center justify-end gap-4 ">
        <ModeToggle />
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <MessageButton />
            <UserButton />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="dark:bg-neutral-700 dark:hover:bg-neutral-800"
            >
              <Link href="/login" className=" transition">
                Login
              </Link>
            </Button>
            <Button
              variant="outline"
              className="dark:bg-neutral-700 dark:hover:bg-neutral-800"
            >
              <Link href="/register" className="transition">
                Register
              </Link>
            </Button>
          </div>
        )}
      </section>
    </nav>
  );
};

export default Navbar;
