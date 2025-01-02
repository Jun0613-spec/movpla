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
exports.currentUser = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const helper_1 = require("../utils/helper");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
    const { email, password, firstName, lastName } = req.body;
    try {
        const existingUser = yield prisma_1.default.user.findFirst({
            where: { email }
        });
        if (existingUser)
            return res.status(400).json({ error: "Email is already in used" });
        if (password.length < 8)
            return res
                .status(400)
                .json({ error: "Password must be at least 8 characters long" });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const registerUser = yield prisma_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                username: `${(firstName === null || firstName === void 0 ? void 0 : firstName.trim()) || ""} ${(lastName === null || lastName === void 0 ? void 0 : lastName.trim()) || ""}`.trim(),
                firstName,
                lastName
            }
        });
        res
            .status(201)
            .json({ message: "User account has been created", user: registerUser });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to register" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
    const { email, password } = req.body;
    try {
        const user = yield prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(400).json({ message: "User not found" });
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid email or password" });
        const accessToken = (0, helper_1.generateAccessToken)(user.id);
        const refreshToken = (0, helper_1.generateRefreshToken)(user.id);
        yield prisma_1.default.refreshToken.create({
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to login" });
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refresh_token } = req.cookies;
    if (!refresh_token)
        return res.status(401).json({ error: "Refresh token not found" });
    try {
        const payload = jsonwebtoken_1.default.verify(refresh_token, process.env.JWT_SECRET_KEY);
        const tokenInDb = yield prisma_1.default.refreshToken.findUnique({
            where: { token: refresh_token }
        });
        if (!tokenInDb)
            return res.status(401).json({ error: "Invalid refresh token" });
        const newAccessToken = (0, helper_1.generateAccessToken)(payload.userId);
        const newRefreshToken = (0, helper_1.generateRefreshToken)(payload.userId);
        // Update the refresh token in the database
        yield prisma_1.default.refreshToken.update({
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
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ error: "Invalid or expired refresh token" });
    }
});
exports.refreshToken = refreshToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refresh_token } = req.cookies;
    try {
        if (refresh_token) {
            const tokenInDb = yield prisma_1.default.refreshToken.findUnique({
                where: { token: refresh_token }
            });
            if (tokenInDb) {
                yield prisma_1.default.refreshToken.delete({
                    where: { token: refresh_token }
                });
            }
        }
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        res.status(200).json({ message: "Logged out" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Failed to logout." });
    }
});
exports.logout = logout;
const currentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get user" });
    }
});
exports.currentUser = currentUser;
