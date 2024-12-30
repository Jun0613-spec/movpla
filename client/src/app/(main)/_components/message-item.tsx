import React from "react";
import { format } from "timeago.js";

import { cn } from "@/lib/utils";

import { Message } from "@/types";

interface MessageItemProps {
  message: Message;
  isSender: boolean;
}

const MessagItem = ({ message, isSender }: MessageItemProps) => {
  return (
    <div
      className={cn(
        "p-4 rounded-xl max-w-[70%]",
        isSender
          ? "self-end  bg-neutral-700 dark:bg-neutral-300 text-white dark:text-black rounded-xl"
          : "self-start  bg-neutral-200 dark:bg-neutral-800 rounded-xll"
      )}
      key={message.id}
    >
      <p className="text-sm">{message.text}</p>
      <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 block">
        {format(message.createdAt)}
      </span>
    </div>
  );
};

export default MessagItem;
