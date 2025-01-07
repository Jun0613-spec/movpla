"use client";

import React from "react";

import ChatBox from "../_components/chat-box";

const MessagesPage = () => {
  return (
    <div className="flex flex-col h-full p-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Chats
      </h1>

      <div className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800">
        <ChatBox />
      </div>
    </div>
  );
};

export default MessagesPage;
