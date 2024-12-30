import express from "express";

import {
  createProperty,
  deleteProperty,
  editProperty,
  getProperties,
  getPropertyById,
  saveProperty
} from "@/controllers/property.controller";

import { verifyToken } from "@/middleware/verify-token";

import upload from "@/configs/multer.config";

const router = express.Router();

router.get("/", getProperties);
router.get("/:propertyId", getPropertyById);
router.post("/save", verifyToken, saveProperty);
router.post("/", verifyToken, upload.array("images"), createProperty);
router.put("/:propertyId", verifyToken, upload.array("images"), editProperty);
router.delete("/:propertyId", verifyToken, deleteProperty);

export default router;
