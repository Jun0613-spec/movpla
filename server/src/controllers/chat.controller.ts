import { Request, Response } from "express";

import prisma from "@/lib/prisma";

export const getChats = async (req: Request, res: Response): Promise<any> => {
  const userId = req.userId;

  if (!userId) return res.json("Unauthorized");

  try {
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            id: userId
          }
        }
      },
      include: {
        participants: true,
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get chats" });
  }
};

export const getChat = async (req: Request, res: Response): Promise<any> => {
  const { chatId } = req.params;

  const userId = req.userId;

  if (!userId) return res.json("Unauthorized");

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        participants: true,
        messages: {
          orderBy: {
            createdAt: "asc"
          }
        }
      }
    });

    if (
      !chat ||
      !chat.participants.some((participant) => participant.id === userId)
    ) {
      return res.status(403).json({ message: "User not part of this chat" });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get a chat" });
  }
};

export const createChat = async (req: Request, res: Response): Promise<any> => {
  const { participantId } = req.body;

  const userId = req.userId;

  if (!userId) return res.json("Unauthorized");

  if (!participantId || participantId === userId)
    return res.status(400).json({ message: "Invalid participant" });

  try {
    const existingChat = await prisma.chat.findFirst({
      where: {
        participants: {
          some: {
            id: { in: [userId, participantId] }
          }
        }
      }
    });

    if (existingChat) {
      return res
        .status(400)
        .json({ message: "Chat with this participant already exists" });
    }

    const newChat = await prisma.chat.create({
      data: {
        participants: {
          connect: [{ id: userId }, { id: participantId }]
        }
      }
    });

    res.status(201).json({ message: "Chat has been created", newChat });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create a chat" });
  }
};

export const deleteChat = async (req: Request, res: Response): Promise<any> => {
  const { chatId } = req.params;

  const userId = req.userId;

  if (!userId) return res.json("Unauthorized");

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { participants: true }
    });

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const isUserPartOfChat = chat.participants.some(
      (participant) => participant.id === userId
    );

    if (!isUserPartOfChat) {
      return res.status(403).json({ message: "User not part of this chat" });
    }

    const deletedChat = await prisma.chat.delete({
      where: { id: chatId }
    });

    res.status(200).json({
      message: "Chat has been deleted successfully",
      deletedChat
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete a chat" });
  }
};
