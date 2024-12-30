"use client";

import React, { useEffect, useState } from "react";
import { MoveLeftIcon, SendIcon, TrashIcon } from "lucide-react";

import Spinner from "@/components/spinner";

import { useSocketStore } from "@/stores/use-socket-store";
import { useAuthStore } from "@/stores/use-auth-store";

import { useGetChats } from "@/hooks/chats/use-get-chats";
import { useCreateMessage } from "@/hooks/messages/use-create-message";
import { useGetMessages } from "@/hooks/messages/use-get-messages";
import { useDeleteChat } from "@/hooks/chats/use-delete-chat";

import { Chat, Message } from "@/types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

const ChatBox = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [typing, setTyping] = useState<boolean>(false);

  const { socket, initSocket, connectSocket } = useSocketStore();
  const { user } = useAuthStore();

  const { data: chats, isLoading: chatsLoading } = useGetChats();
  const {
    data: messages,
    isLoading: messagesLoading,
    refetch: refetchMessages
  } = useGetMessages({ chatId: activeChatId || "" });

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: deleteChat } = useDeleteChat();

  useEffect(() => {
    if (!socket) {
      initSocket();
    }

    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket, connectSocket, initSocket]);

  useEffect(() => {
    if (socket) {
      socket.on("message", (message) => {
        if (message.chatId === activeChatId) {
          refetchMessages();
        }
      });

      socket.on("typing", (userId) => {
        if (userId !== user?.id && activeChatId) {
          setTyping(true);
        } else {
          setTyping(false);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("message");
        socket.off("typing");
      }
    };
  }, [socket, activeChatId, refetchMessages, user?.id]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !activeChatId) return;

    createMessage(
      { chatId: activeChatId, text: newMessage },
      {
        onSuccess: () => {
          setNewMessage("");
        }
      }
    );
  };

  const handleDeleteChat = (chatId: string) => {
    deleteChat({ chatId });
  };

  const handleTyping = () => {
    if (socket && activeChatId) {
      socket.emit("typing", user?.id);
    }
  };

  const handleBackClick = () => {
    setActiveChatId(null);
  };

  if (chatsLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col sm:flex-row h-full">
      {/* Sidebar for Chats */}
      <aside className="w-full sm:w-1/4 border-b sm:border-r dark:bg-neutral-800 dark:border-neutral-600 sm:h-full sm:overflow-y-auto">
        <ul className="space-y-2 p-2">
          {chats?.length === 0 ? (
            <p className="text-center text-neutral-500 dark:text-neutral-400">
              There are no chats yet
            </p>
          ) : (
            chats?.map((chat: Chat) => {
              const otherParticipant = chat.participants.find(
                (participant) => participant.id !== user?.id
              );

              return (
                <li
                  key={chat.id}
                  className={cn(
                    "flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition",
                    chat.id === activeChatId
                      ? "bg-neutral-100 dark:bg-neutral-700"
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  )}
                  onClick={() => setActiveChatId(chat.id)}
                >
                  <Avatar className="size-10">
                    <AvatarImage
                      src={otherParticipant?.avatarImage}
                      alt={otherParticipant?.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <AvatarFallback className="font-medium text-white bg-neutral-400 dark:bg-neutral-600 flex items-center justify-center text-lg">
                      {otherParticipant?.username
                        ? otherParticipant.username[0].toUpperCase()
                        : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-black dark:text-white">
                      {otherParticipant?.username || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {chat.lastMessage || "No messages yet"}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDeleteChat(chat.id)} // Fixed the click handler
                    className="p-2 ml-2 rounded-lg bg-red-500 dark:bg-red-700 text-white hover:bg-red-600 dark:hover:bg-red-800"
                  >
                    <TrashIcon />
                  </Button>
                </li>
              );
            })
          )}
        </ul>
      </aside>

      {/* Chat Window */}
      <section className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900">
        {/* Back Button */}
        {activeChatId && (
          <div className="p-4 sm:hidden">
            <Button variant="muted" onClick={handleBackClick}>
              <MoveLeftIcon />
            </Button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messagesLoading ? (
            <Spinner />
          ) : (
            messages?.map((message: Message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-end space-x-2",
                  message.senderId === user?.id
                    ? "justify-end"
                    : "justify-start"
                )}
              >
                {message.senderId !== user?.id && (
                  <Avatar>
                    <AvatarImage
                      src={message.sender?.avatarImage || ""}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  </Avatar>
                )}
                <div
                  className={cn(
                    "p-3 rounded-lg",
                    message.senderId === user?.id
                      ? "bg-blue-500 dark:bg-blue-700 text-white"
                      : "bg-gray-200 dark:bg-gray-700"
                  )}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))
          )}
          {typing && (
            <p className="italic text-neutral-500 dark:text-neutral-400">
              Typing...
            </p>
          )}

          {activeChatId && (
            <div className="flex items-center space-x-2 p-4 dark:bg-neutral-800 border-t dark:border-neutral-600">
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                className="flex-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white"
              />

              <Button
                onClick={handleSendMessage}
                className="p-2 rounded-lg bg-blue-500 dark:bg-blue-700 text-white hover:bg-blue-600 dark:hover:bg-blue-800"
              >
                <SendIcon />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChatBox;
