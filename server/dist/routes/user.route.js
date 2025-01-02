"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_config_1 = __importDefault(require("../configs/multer.config"));
const user_controller_1 = require("../controllers/user.controller");
const verify_token_1 = require("../middleware/verify-token");
const router = express_1.default.Router();
router.get("/", user_controller_1.getAllUsers);
router.get("/:userId", user_controller_1.getUserById);
router.get("/profile/properties", verify_token_1.verifyToken, user_controller_1.getUsersProperties);
router.put("/", verify_token_1.verifyToken, multer_config_1.default.single("avatarImage"), user_controller_1.updateUser);
router.delete("/", verify_token_1.verifyToken, user_controller_1.deleteUser);
exports.default = router;
