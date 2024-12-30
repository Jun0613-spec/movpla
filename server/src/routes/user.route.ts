import express from "express";

import upload from "@/configs/multer.config";

import {
  deleteUser,
  getAllUsers,
  getUserById,
  getUsersProperties,
  updateUser
} from "@/controllers/user.controller";

import { verifyToken } from "@/middleware/verify-token";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:userId", getUserById);
router.get("/profile/properties", verifyToken, getUsersProperties);
router.put("/", verifyToken, upload.single("avatarImage"), updateUser);
router.delete("/", verifyToken, deleteUser);

export default router;
