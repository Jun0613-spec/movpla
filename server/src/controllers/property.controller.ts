import { Request, Response } from "express";

import prisma from "@/lib/prisma";

import { uploadImages } from "@/utils/upload-image";
import { toBoolean } from "@/utils/helper";

import { ListingType, PropertyType } from "@prisma/client";

export const getProperties = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { city, listingType, propertyType, bedroom, minPrice, maxPrice } =
    req.query;

  try {
    const properties = await prisma.property.findMany({
      where: {
        city: typeof city === "string" ? city : undefined,
        listingType:
          typeof listingType === "string"
            ? (listingType as ListingType)
            : undefined,
        propertyType:
          typeof propertyType === "string"
            ? (propertyType as PropertyType)
            : undefined,
        bedroom: bedroom ? parseInt(bedroom as string) : undefined,
        price: {
          gte: minPrice ? parseInt(minPrice as string) : undefined,
          lte: maxPrice ? parseInt(maxPrice as string) : undefined
        }
      }
    });

    res.status(200).json(properties);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get properties" });
  }
};

export const getPropertyById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { propertyId } = req.params;

  try {
    const existProperty = await prisma.property.findUnique({
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
      ? !!(await prisma.savedProperty.findUnique({
          where: {
            userId_propertyId: {
              propertyId,
              userId: req.userId
            }
          }
        }))
      : false;

    res.status(200).json({ existProperty, isSaved });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get post" });
  }
};

export const saveProperty = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { propertyId } = req.body;

  const userId = req.userId;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const savedProperty = await prisma.savedProperty.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId: propertyId
        }
      }
    });

    if (savedProperty) {
      await prisma.savedProperty.delete({
        where: {
          id: savedProperty.id
        }
      });

      return res
        .status(200)
        .json({ message: "Property removed from saved list", isSaved: false });
    }

    const saveProperty = await prisma.savedProperty.create({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to save the property" });
  }
};

export const createProperty = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const {
    title,
    desc,
    price,
    address,
    postcode,
    city,
    bedroom,
    bathroom,
    latitude,
    longitude,
    listingType,
    propertyType,
    furnishedType,
    pet,
    garden,
    balcony,
    parking,
    size
  } = req.body;

  try {
    let imageUrls: string[] = [];

    if (req.files && Array.isArray(req.files)) {
      const uploadedFiles = await uploadImages(
        req.files as Express.Multer.File[]
      );

      imageUrls = uploadedFiles;
    }

    const newProperty = await prisma.property.create({
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
        pet: toBoolean(pet),
        garden: toBoolean(garden),
        balcony: toBoolean(balcony),
        parking: toBoolean(parking),
        size: size ? parseInt(size) : null,
        images: imageUrls,
        userId
      }
    });

    res.status(201).json({
      message: "Post has been created",
      property: newProperty
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create a property" });
  }
};

export const editProperty = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;
  const { propertyId } = req.params;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const {
    title,
    desc,
    price,
    address,
    postcode,
    city,
    bedroom,
    bathroom,
    latitude,
    longitude,
    listingType,
    propertyType,
    pet,
    garden,
    balcony,
    parking,
    furnishedType,
    size
  } = req.body;

  try {
    const existProperty = await prisma.property.findUnique({
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

    let imageUrls: string[] = existProperty.images || [];

    if (req.files && Array.isArray(req.files)) {
      const uploadedFiles = await uploadImages(
        req.files as Express.Multer.File[]
      );
      imageUrls = uploadedFiles.length > 0 ? uploadedFiles : imageUrls;
    }

    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: {
        title: title || existProperty.title,
        desc: desc || existProperty?.desc,
        price: price !== undefined ? parseInt(price) : existProperty.price,
        address: address || existProperty.address,
        postcode: postcode || existProperty.postcode,
        city: city || existProperty.city,
        bedroom:
          bedroom !== undefined ? parseInt(bedroom) : existProperty.bedroom,
        bathroom:
          bathroom !== undefined ? parseInt(bathroom) : existProperty.bathroom,
        latitude: latitude || existProperty.latitude,
        longitude: longitude || existProperty.longitude,
        listingType: listingType || existProperty.listingType,
        propertyType: propertyType || existProperty.propertyType,
        images: imageUrls || existProperty.images,
        pet: pet !== undefined ? toBoolean(pet.toString()) : existProperty.pet,
        garden:
          garden !== undefined
            ? toBoolean(garden.toString())
            : existProperty.garden,
        balcony:
          balcony !== undefined
            ? toBoolean(balcony.toString())
            : existProperty.balcony,
        parking:
          parking !== undefined
            ? toBoolean(parking.toString())
            : existProperty.parking,
        furnishedType: furnishedType || existProperty.furnishedType,
        size: size !== undefined ? parseInt(size) : existProperty.size
      }
    });

    res.status(200).json({
      message: "Property has been updated",
      updatedProperty
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to edit a post" });
  }
};

export const deleteProperty = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;
  const { propertyId } = req.params;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const existPost = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!existPost)
      return res.status(404).json({ error: "Property not found" });

    if (existPost.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You do not have a permission to edit this property" });
    }

    await prisma.property.delete({
      where: { id: propertyId }
    });

    res.status(200).json({ message: "Property has been deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete a property" });
  }
};
