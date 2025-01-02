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
exports.deleteProperty = exports.editProperty = exports.createProperty = exports.saveProperty = exports.getPropertyById = exports.getProperties = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const upload_image_1 = require("../utils/upload-image");
const helper_1 = require("../utils/helper");
const getProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { city, listingType, propertyType, bedroom, minPrice, maxPrice } = req.query;
    try {
        const properties = yield prisma_1.default.property.findMany({
            where: {
                city: typeof city === "string" ? city : undefined,
                listingType: typeof listingType === "string"
                    ? listingType
                    : undefined,
                propertyType: typeof propertyType === "string"
                    ? propertyType
                    : undefined,
                bedroom: bedroom ? parseInt(bedroom) : undefined,
                price: {
                    gte: minPrice ? parseInt(minPrice) : undefined,
                    lte: maxPrice ? parseInt(maxPrice) : undefined
                }
            }
        });
        res.status(200).json(properties);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to get properties" });
    }
});
exports.getProperties = getProperties;
const getPropertyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { propertyId } = req.params;
    try {
        const existProperty = yield prisma_1.default.property.findUnique({
            where: { id: propertyId },
            include: {
                user: {
                    select: {
                        username: true,
                        avatarImage: true
                    }
                }
            }
        });
        if (!existProperty)
            return res.status(404).json({ error: "Property not found" });
        const isSaved = req.userId
            ? !!(yield prisma_1.default.savedProperty.findUnique({
                where: {
                    userId_propertyId: {
                        propertyId,
                        userId: req.userId
                    }
                }
            }))
            : false;
        res.status(200).json({ existProperty, isSaved });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to get post" });
    }
});
exports.getPropertyById = getPropertyById;
const saveProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { propertyId } = req.body;
    const userId = req.userId;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const savedProperty = yield prisma_1.default.savedProperty.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId: propertyId
                }
            }
        });
        if (savedProperty) {
            yield prisma_1.default.savedProperty.delete({
                where: {
                    id: savedProperty.id
                }
            });
            return res
                .status(200)
                .json({ message: "Property removed from saved list", isSaved: false });
        }
        const saveProperty = yield prisma_1.default.savedProperty.create({
            data: {
                userId,
                propertyId: propertyId,
                isSaved: true
            }
        });
        res.status(200).json({
            message: "Property has been saved",
            saveProperty,
            isSaved: true
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to save the property" });
    }
});
exports.saveProperty = saveProperty;
const createProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    const { title, desc, price, address, postcode, city, bedroom, bathroom, latitude, longitude, listingType, propertyType, furnishedType, pet, garden, balcony, parking, size } = req.body;
    try {
        let imageUrls = [];
        if (req.files && Array.isArray(req.files)) {
            const uploadedFiles = yield (0, upload_image_1.uploadImages)(req.files);
            imageUrls = uploadedFiles;
        }
        const newProperty = yield prisma_1.default.property.create({
            data: {
                title,
                desc,
                price: parseInt(price),
                address,
                city,
                postcode,
                bedroom: parseInt(bedroom) || null,
                bathroom: parseInt(bathroom) || null,
                latitude,
                longitude,
                listingType,
                propertyType,
                furnishedType: furnishedType || null,
                pet: (0, helper_1.toBoolean)(pet),
                garden: (0, helper_1.toBoolean)(garden),
                balcony: (0, helper_1.toBoolean)(balcony),
                parking: (0, helper_1.toBoolean)(parking),
                size: size ? parseInt(size) : null,
                images: imageUrls,
                userId
            }
        });
        res.status(201).json({
            message: "Post has been created",
            property: newProperty
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create a property" });
    }
});
exports.createProperty = createProperty;
const editProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { propertyId } = req.params;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    const { title, desc, price, address, postcode, city, bedroom, bathroom, latitude, longitude, listingType, propertyType, pet, garden, balcony, parking, furnishedType, size } = req.body;
    try {
        const existProperty = yield prisma_1.default.property.findUnique({
            where: { id: propertyId },
            include: { user: true }
        });
        if (!existProperty)
            return res.status(404).json({ error: "Property not found" });
        if (existProperty.userId !== userId) {
            return res
                .status(403)
                .json({ error: "You do not have a permission to edit this post" });
        }
        let imageUrls = existProperty.images || [];
        if (req.files && Array.isArray(req.files)) {
            const uploadedFiles = yield (0, upload_image_1.uploadImages)(req.files);
            imageUrls = uploadedFiles.length > 0 ? uploadedFiles : imageUrls;
        }
        const updatedProperty = yield prisma_1.default.property.update({
            where: { id: propertyId },
            data: {
                title: title || existProperty.title,
                desc: desc || (existProperty === null || existProperty === void 0 ? void 0 : existProperty.desc),
                price: price !== undefined ? parseInt(price) : existProperty.price,
                address: address || existProperty.address,
                postcode: postcode || existProperty.postcode,
                city: city || existProperty.city,
                bedroom: bedroom !== undefined ? parseInt(bedroom) : existProperty.bedroom,
                bathroom: bathroom !== undefined ? parseInt(bathroom) : existProperty.bathroom,
                latitude: latitude || existProperty.latitude,
                longitude: longitude || existProperty.longitude,
                listingType: listingType || existProperty.listingType,
                propertyType: propertyType || existProperty.propertyType,
                images: imageUrls || existProperty.images,
                pet: pet !== undefined ? (0, helper_1.toBoolean)(pet.toString()) : existProperty.pet,
                garden: garden !== undefined
                    ? (0, helper_1.toBoolean)(garden.toString())
                    : existProperty.garden,
                balcony: balcony !== undefined
                    ? (0, helper_1.toBoolean)(balcony.toString())
                    : existProperty.balcony,
                parking: parking !== undefined
                    ? (0, helper_1.toBoolean)(parking.toString())
                    : existProperty.parking,
                furnishedType: furnishedType || existProperty.furnishedType,
                size: size !== undefined ? parseInt(size) : existProperty.size
            }
        });
        res.status(200).json({
            message: "Property has been updated",
            updatedProperty
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to edit a post" });
    }
});
exports.editProperty = editProperty;
const deleteProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { propertyId } = req.params;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const existPost = yield prisma_1.default.property.findUnique({
            where: { id: propertyId }
        });
        if (!existPost)
            return res.status(404).json({ error: "Property not found" });
        if (existPost.userId !== userId) {
            return res
                .status(403)
                .json({ error: "You do not have a permission to edit this property" });
        }
        yield prisma_1.default.property.delete({
            where: { id: propertyId }
        });
        res.status(200).json({ message: "Property has been deleted" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to delete a property" });
    }
});
exports.deleteProperty = deleteProperty;
