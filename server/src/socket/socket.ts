import { Server, Socket } from "socket.io";

import prisma from "@/lib/prisma";

interface OnlineUser {
  userId: string;
  socketId: string;
}

let onlineUsers: OnlineUser[] = [];

const addUser = (userId: string, socketId: string) => {
  if (!onlineUsers.some((user) => user.userId === userId)) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId: string) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId: string): OnlineUser | undefined =>
  onlineUsers.find((user) => user.userId === userId);

export const initializeSocket = (io: Server): void => {
  io.on("connection", (socket: Socket) => {
    socket.on("newUser", (userId: string) => addUser(userId, socket.id));

    socket.on(
      "sendMessage",
      async ({
        chatId,
        senderId,
        text
      }: {
        chatId: string;
        senderId: string;
        text: string;
      }) => {
        const message = await prisma.message.create({
          data: { text, senderId, chatId }
        });

        const chat = await prisma.chat.findUnique({
          where: { id: chatId },
          include: { participants: true }
        });

        chat?.participants.forEach((user) => {
          const recipient = getUser(user.id);
          if (recipient) io.to(recipient.socketId).emit("message", message);
        });
      }
    );

    socket.on("disconnect", () => removeUser(socket.id));
  });
};
