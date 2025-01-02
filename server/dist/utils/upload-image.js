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
exports.uploadImageFromUrl = exports.uploadImage = exports.uploadImages = void 0;
const axios_1 = __importDefault(require("axios"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const uploadImages = (imageFiles) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadPromises = imageFiles.map((image) => __awaiter(void 0, void 0, void 0, function* () {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = yield cloudinary_1.default.v2.uploader.upload(dataURI);
        return res.url;
    }));
    const imageUrls = yield Promise.all(uploadPromises);
    return imageUrls;
});
exports.uploadImages = uploadImages;
const uploadImage = (imageFile) => __awaiter(void 0, void 0, void 0, function* () {
    const b64 = Buffer.from(imageFile.buffer).toString("base64");
    let dataURI = "data:" + imageFile.mimetype + ";base64," + b64;
    const res = yield cloudinary_1.default.v2.uploader.upload(dataURI);
    return res.url;
});
exports.uploadImage = uploadImage;
const uploadImageFromUrl = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(imageUrl, {
            responseType: "arraybuffer"
        });
        const b64 = Buffer.from(response.data).toString("base64");
        const dataURI = `data:image/jpeg;base64,${b64}`;
        const res = yield cloudinary_1.default.v2.uploader.upload(dataURI);
        return res.url;
    }
    catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw new Error("Failed to upload image to Cloudinary");
    }
});
exports.uploadImageFromUrl = uploadImageFromUrl;
