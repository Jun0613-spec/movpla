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
exports.initializeSocket = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
let onlineUsers = [];
const addUser = (userId, socketId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
        onlineUsers.push({ userId, socketId });
    }
};
const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
    return onlineUsers.find((user) => user.userId === userId);
};
const initializeSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("A user connected", socket.id);
        socket.on("newUser", (userId) => {
            addUser(userId, socket.id);
            console.log("User added:", userId);
        });
        socket.on("sendMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ chatId, senderId, text }) {
            try {
                const message = yield prisma_1.default.message.create({
                    data: {
                        text,
                        senderId,
                        chatId
                    }
                });
                yield prisma_1.default.chat.update({
                    where: { id: chatId },
                    data: {
                        lastMessage: text,
                        updatedAt: new Date()
                    }
                });
                const chat = yield prisma_1.default.chat.findUnique({
                    where: { id: chatId },
                    include: { participants: true }
                });
                if (chat) {
                    chat.participants.forEach((user) => {
                        const receiver = getUser(user.id);
                        if (receiver && receiver.userId !== senderId) {
                            io.to(receiver.socketId).emit("getMessage", {
                                chatId,
                                message
                            });
                        }
                    });
                }
            }
            catch (error) {
                console.error("Error sending message:", error);
            }
        }));
        socket.on("disconnect", () => {
            console.log("A user disconnected", socket.id);
            removeUser(socket.id);
        });
    });
};
exports.initializeSocket = initializeSocket;
