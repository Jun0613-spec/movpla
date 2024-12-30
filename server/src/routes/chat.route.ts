import express from "express";

import { verifyToken } from "@/middleware/verify-token";
import {
  createChat,
  deleteChat,
  getChat,
  getChats
} from "@/controllers/chat.controller";

const router = express.Router();

router.get("/", verifyToken, getChats);
router.get("/:chatId", verifyToken, getChat);
router.post("/", verifyToken, createChat);
router.delete("/:chatId", verifyToken, deleteChat);

export default router;
