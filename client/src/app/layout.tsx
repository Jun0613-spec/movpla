import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import QueryProvider from "@/components/providers/query-provider";

import { Toaster } from "@/components/ui/sonner";

import Modals from "@/components/modals";

import { cn } from "@/lib/utils";

const font = DM_Sans({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Movpla",
  description: "Propertyy application",
  icons: {
    icon: "/images/logo-dark.svg",
    shortcut: "/images/logo-dark.svg",
    apple: "/images/logo-dark.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(font.className, "antialiased min-h-screen")}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Modals />
            <Toaster richColors closeButton />
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
