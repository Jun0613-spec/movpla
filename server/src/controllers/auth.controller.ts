import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";

import { generateAccessToken, generateRefreshToken } from "@/utils/helper";

export const register = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  const { email, password, firstName, lastName } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email }
    });

    if (existingUser)
      return res.status(400).json({ error: "Email is already in used" });

    if (password.length < 8)
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const registerUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username: `${firstName?.trim() || ""} ${lastName?.trim() || ""}`.trim(),
        firstName,
        lastName
      }
    });

    res
      .status(201)
      .json({ message: "User account has been created", user: registerUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to register" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id }
    });

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000 // 15 minutes in milliseconds
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    res.status(200).json({ userId: user.id, accessToken, refreshToken, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to login" });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { refresh_token } = req.cookies;

  if (!refresh_token)
    return res.status(401).json({ error: "Refresh token not found" });

  try {
    const payload = jwt.verify(
      refresh_token,
      process.env.JWT_SECRET_KEY as string
    ) as { userId: string };

    const tokenInDb = await prisma.refreshToken.findUnique({
      where: { token: refresh_token }
    });

    if (!tokenInDb)
      return res.status(401).json({ error: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(payload.userId);
    const newRefreshToken = generateRefreshToken(payload.userId);

    // Update the refresh token in the database
    await prisma.refreshToken.update({
      where: { token: refresh_token },
      data: { token: newRefreshToken }
    });

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000 // 15 minutes in milliseconds
    });

    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.log(error);
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  const { refresh_token } = req.cookies;

  try {
    if (refresh_token) {
      const tokenInDb = await prisma.refreshToken.findUnique({
        where: { token: refresh_token }
      });

      if (tokenInDb) {
        await prisma.refreshToken.delete({
          where: { token: refresh_token }
        });
      }
    }

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to logout." });
  }
};

export const currentUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get user" });
  }
};
