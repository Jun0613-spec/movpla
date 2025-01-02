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
exports.deleteChat = exports.createChat = exports.getChat = exports.getChats = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId)
        return res.json("Unauthorized");
    try {
        const chats = yield prisma_1.default.chat.findMany({
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get chats" });
    }
});
exports.getChats = getChats;
const getChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    const userId = req.userId;
    if (!userId)
        return res.json("Unauthorized");
    try {
        const chat = yield prisma_1.default.chat.findUnique({
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
        if (!chat ||
            !chat.participants.some((participant) => participant.id === userId)) {
            return res.status(403).json({ message: "User not part of this chat" });
        }
        res.status(200).json(chat);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get a chat" });
    }
});
exports.getChat = getChat;
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { participantId } = req.body;
    const userId = req.userId;
    if (!userId)
        return res.json("Unauthorized");
    if (!participantId || participantId === userId)
        return res.status(400).json({ message: "Invalid participant" });
    try {
        const newChat = yield prisma_1.default.chat.create({
            data: {
                participants: {
                    connect: [{ id: userId }, { id: participantId }]
                }
            },
            include: {
                participants: true
            }
        });
        res.status(201).json({ message: "Chat has been created", newChat });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create a chat" });
    }
});
exports.createChat = createChat;
const deleteChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    const userId = req.userId;
    if (!userId)
        return res.json("Unauthorized");
    try {
        const chat = yield prisma_1.default.chat.findUnique({
            where: { id: chatId },
            include: { participants: true }
        });
        if (!chat)
            return res.status(404).json({ message: "Chat not found" });
        const isUserPartOfChat = chat.participants.some((participant) => participant.id === userId);
        if (!isUserPartOfChat) {
            return res.status(403).json({ message: "User not part of this chat" });
        }
        const deletedChat = yield prisma_1.default.chat.delete({
            where: { id: chatId }
        });
        res.status(200).json({
            message: "Chat has been deleted successfully",
            deletedChat
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to delete a chat" });
    }
});
exports.deleteChat = deleteChat;
