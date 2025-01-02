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
exports.deleteUser = exports.updateUser = exports.getUsersProperties = exports.getUserById = exports.getAllUsers = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const upload_image_1 = require("../utils/upload-image");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.default.user.findMany();
        res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to get users" });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user)
            return res.status(404).json({ error: "User does not exist" });
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to get user" });
    }
});
exports.getUserById = getUserById;
const getUsersProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const existedUser = yield prisma_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!existedUser)
            return res.status(404).json({ error: "User not found" });
        const userProperties = yield prisma_1.default.property.findMany({
            where: { userId }
        });
        const saved = yield prisma_1.default.savedProperty.findMany({
            where: { userId },
            include: { property: true }
        });
        const savedProperties = saved.map((item) => item.property);
        return res.status(200).json({
            userProperties,
            savedProperties
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to get users properties" });
    }
});
exports.getUsersProperties = getUsersProperties;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { firstName, lastName } = req.body;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        let avatarImageUrl = null;
        if (req.file) {
            try {
                avatarImageUrl = yield (0, upload_image_1.uploadImage)(req.file);
            }
            catch (error) {
                return res.status(500).json({ error: "Failed to upload image" });
            }
        }
        const updatedUser = yield prisma_1.default.user.update({
            where: { id: userId },
            data: {
                firstName: firstName || undefined,
                lastName: lastName || undefined,
                username: `${(firstName === null || firstName === void 0 ? void 0 : firstName.trim()) || ""} ${(lastName === null || lastName === void 0 ? void 0 : lastName.trim()) || ""}`.trim() ||
                    undefined,
                avatarImage: avatarImageUrl || undefined
            }
        });
        res.status(200).json({ message: "User has been updated", updatedUser });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to update user" });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        if (user.id !== userId) {
            return res.status(403).json({
                error: "You do not have permission to delete this user"
            });
        }
        yield prisma_1.default.refreshToken.deleteMany({
            where: { userId: userId }
        });
        const deletedUser = yield prisma_1.default.user.delete({
            where: { id: userId }
        });
        res.status(200).json({
            message: "User has been deleted",
            deletedUser
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to delete user"
        });
    }
});
exports.deleteUser = deleteUser;
