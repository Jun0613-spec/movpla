"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const property_controller_1 = require("../controllers/property.controller");
const verify_token_1 = require("../middleware/verify-token");
const multer_config_1 = __importDefault(require("../configs/multer.config"));
const router = express_1.default.Router();
router.get("/", property_controller_1.getProperties);
router.get("/:propertyId", property_controller_1.getPropertyById);
router.post("/save", verify_token_1.verifyToken, property_controller_1.saveProperty);
router.post("/", verify_token_1.verifyToken, multer_config_1.default.array("images"), property_controller_1.createProperty);
router.put("/:propertyId", verify_token_1.verifyToken, multer_config_1.default.array("images"), property_controller_1.editProperty);
router.delete("/:propertyId", verify_token_1.verifyToken, property_controller_1.deleteProperty);
exports.default = router;
