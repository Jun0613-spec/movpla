import express from "express";

import { verifyToken } from "@/middleware/verify-token";
import { createMessage, getMessages } from "@/controllers/message.controller";

const router = express.Router();

router.get("/:chatId", verifyToken, getMessages);
router.post("/:chatId", verifyToken, createMessage);

export default router;
