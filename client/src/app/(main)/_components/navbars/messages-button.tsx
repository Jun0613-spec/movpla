import React from "react";
import Link from "next/link";
import { MailIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useGetMessagesCount } from "@/hooks/messages/use-get-messages-count";

import { useChatId } from "@/hooks/chats/use-chat-id";

const MessageButton = () => {
  const chatId = useChatId();
  const { data, isError } = useGetMessagesCount({ chatId });

  const unreadCount = data?.unreadCount;

  return (
    <Link href="/messages">
      <Button
        variant="muted"
        size="icon"
        className="relative flex items-center justify-center p-3 border-none cursor-pointer"
      >
        {isError ? (
          <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
            !
          </div>
        ) : (
          Number(unreadCount) > 0 && (
            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
              {unreadCount}
            </div>
          )
        )}
        <MailIcon className="!h-5 !w-5 text-neutral-800 dark:text-neutral-200" />
      </Button>
    </Link>
  );
};

export default MessageButton;
