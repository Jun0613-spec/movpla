import { Request, Response } from "express";
import { validationResult } from "express-validator";

import prisma from "@/lib/prisma";

import { uploadImage } from "@/utils/upload-image";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get users" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) return res.status(404).json({ error: "User does not exist" });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get user" });
  }
};

export const getUsersProperties = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const existedUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existedUser) return res.status(404).json({ error: "User not found" });

    const userProperties = await prisma.property.findMany({
      where: { userId }
    });

    const saved = await prisma.savedProperty.findMany({
      where: { userId },
      include: { property: true }
    });

    const savedProperties = saved.map((item) => item.property);

    return res.status(200).json({
      userProperties,
      savedProperties
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get users properties" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const userId = req.userId;
  const { firstName, lastName } = req.body;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    let avatarImageUrl: string | null = null;

    if (req.file) {
      try {
        avatarImageUrl = await uploadImage(req.file);
      } catch (error) {
        return res.status(500).json({ error: "Failed to upload image" });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        username:
          `${firstName?.trim() || ""} ${lastName?.trim() || ""}`.trim() ||
          undefined,
        avatarImage: avatarImageUrl || undefined
      }
    });

    res.status(200).json({ message: "User has been updated", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.id !== userId) {
      return res.status(403).json({
        error: "You do not have permission to delete this user"
      });
    }

    await prisma.refreshToken.deleteMany({
      where: { userId: userId }
    });

    const deletedUser = await prisma.user.delete({
      where: { id: userId }
    });

    res.status(200).json({
      message: "User has been deleted",
      deletedUser
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete user"
    });
  }
};
