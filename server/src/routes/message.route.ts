import express from "express";

import { verifyToken } from "@/middleware/verify-token";
import {
  createMessage,
  getMessages,
  getUnreadMessagesCount,
  readMessage
} from "@/controllers/message.controller";

const router = express.Router();

router.get("/:chatId", verifyToken, getMessages);
router.post("/:chatId", verifyToken, createMessage);
router.get("/:chatId/count", verifyToken, getUnreadMessagesCount);
router.put("/:messageId", verifyToken, readMessage);

export default router;
