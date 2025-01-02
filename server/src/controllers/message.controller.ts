import { Request, Response } from "express";

import prisma from "@/lib/prisma";

export const getMessages = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { chatId } = req.params;

  const userId = req.userId;

  if (!userId) return res.json("Unauthorized");

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { participants: true }
    });

    if (
      !chat ||
      !chat.participants.some((participant) => participant.id === userId)
    ) {
      return res.status(403).json({ message: "User not part of this chat" });
    }

    const messages = await prisma.message.findMany({
      where: { chatId: chatId },
      orderBy: { createdAt: "asc" }
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get messages" });
  }
};

export const createMessage = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { chatId } = req.params;
  const { text } = req.body;

  const userId = req.userId;

  if (!userId) return res.json("Unauthorized");

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { participants: true }
    });

    if (
      !chat ||
      !chat.participants.some((participant) => participant.id === userId)
    ) {
      return res.status(403).json({ message: "User not part of this chat" });
    }

    const newMessage = await prisma.message.create({
      data: {
        chatId,
        senderId: userId,
        text
      }
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: {
        lastMessage: text
      }
    });

    res.status(201).json({ message: " Message has been sent", newMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to send a message" });
  }
};
