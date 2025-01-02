"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_token_1 = require("../middleware/verify-token");
const chat_controller_1 = require("../controllers/chat.controller");
const router = express_1.default.Router();
router.get("/", verify_token_1.verifyToken, chat_controller_1.getChats);
router.get("/:chatId", verify_token_1.verifyToken, chat_controller_1.getChat);
router.post("/", verify_token_1.verifyToken, chat_controller_1.createChat);
router.delete("/:chatId", verify_token_1.verifyToken, chat_controller_1.deleteChat);
exports.default = router;
