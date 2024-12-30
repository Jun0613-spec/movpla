import { LoaderCircle } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

const Spinner = ({
  size = 18,
  color = "text-muted-foreground",
  className = ""
}: LoaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-y-4 items-center justify-center h-12",
        className
      )}
    >
      <LoaderCircle
        className={cn("animate-spin", color)}
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default Spinner;
