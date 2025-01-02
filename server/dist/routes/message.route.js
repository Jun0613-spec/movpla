"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_token_1 = require("../middleware/verify-token");
const message_controller_1 = require("../controllers/message.controller");
const router = express_1.default.Router();
router.get("/:chatId", verify_token_1.verifyToken, message_controller_1.getMessages);
router.post("/:chatId", verify_token_1.verifyToken, message_controller_1.createMessage);
exports.default = router;
