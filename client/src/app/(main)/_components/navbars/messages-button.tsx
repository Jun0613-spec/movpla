import React from "react";
import Link from "next/link";
import { MailIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const MessageButton = () => {
  return (
    <Link href="/messages">
      <Button
        variant="muted"
        size="icon"
        className=" flex items-center justify-center p-3 border-none cursor-pointer"
      >
        <MailIcon className="!h-5 !w-5 text-neutral-800 dark:text-neutral-200" />
      </Button>
    </Link>
  );
};

export default MessageButton;
