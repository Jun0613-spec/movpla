"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBoolean = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "15m"
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d"
    });
};
exports.generateRefreshToken = generateRefreshToken;
const toBoolean = (value, defaultValue = false) => {
    if (value === undefined || value === null)
        return defaultValue;
    return value.toLowerCase() === "true";
};
exports.toBoolean = toBoolean;
