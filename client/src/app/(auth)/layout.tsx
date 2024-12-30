"use client";

import React, { ReactNode, useEffect } from "react";

import ModeToggle from "@/components/mode-toggle";

import { useAuthStore } from "@/stores/use-auth-store";
import { useRouter } from "next/navigation";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { isAuthenticated } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-lg px-6 py-8 border dark:border-neutral-700 rounded-xl ">
        <div className="absolute top-4 left-4">
          <ModeToggle />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
