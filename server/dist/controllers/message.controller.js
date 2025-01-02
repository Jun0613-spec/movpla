"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = exports.getMessages = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    const userId = req.userId;
    if (!userId)
        return res.json("Unauthorized");
    try {
        const chat = yield prisma_1.default.chat.findUnique({
            where: { id: chatId },
            include: { participants: true }
        });
        if (!chat ||
            !chat.participants.some((participant) => participant.id === userId)) {
            return res.status(403).json({ message: "User not part of this chat" });
        }
        const messages = yield prisma_1.default.message.findMany({
            where: { chatId: chatId },
            orderBy: { createdAt: "asc" }
        });
        res.status(200).json(messages);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to get messages" });
    }
});
exports.getMessages = getMessages;
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    const { text } = req.body;
    const userId = req.userId;
    if (!userId)
        return res.json("Unauthorized");
    try {
        const chat = yield prisma_1.default.chat.findUnique({
            where: { id: chatId },
            include: { participants: true }
        });
        if (!chat ||
            !chat.participants.some((participant) => participant.id === userId)) {
            return res.status(403).json({ message: "User not part of this chat" });
        }
        const newMessage = yield prisma_1.default.message.create({
            data: {
                chatId,
                senderId: userId,
                text
            }
        });
        yield prisma_1.default.chat.update({
            where: { id: chatId },
            data: {
                lastMessage: text
            }
        });
        res.status(201).json({ message: " Message has been sent", newMessage });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to send a message" });
    }
});
exports.createMessage = createMessage;
