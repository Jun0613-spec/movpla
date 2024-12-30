import { z } from "zod";

//* Auth *//
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email")
    .max(100, "Email cannot be longer than 100 characters"),
  password: z
    .string()
    .min(8, "Minumum 8 characters required")
    .max(16, "Password cannot be longer than 16 characters")
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name cannot be longer than 50 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name cannot be longer than 50 characters"),
  email: z
    .string()
    .email("Invalid email")
    .max(100, "Email cannot be longer than 100 characters"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const createPostSchema = z.object({
  content: z.string().trim().min(1, "Minimum 1 character required"),
  images: z
    .array(
      z.union([
        z.instanceof(File),
        z.string().transform((value) => (value === "" ? undefined : value))
      ])
    )
    .optional()
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1, "Minimum 1 character required"),
  lastName: z.string().min(1, "Minimum 1 character required"),
  avatarImage: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value))
    ])
    .optional()
});

const ListingTypeEnum = z.enum(["ForSale", "ToRent", "Sold", "Rented"]);

const PropertyTypeEnum = z.enum([
  "House",
  "Flat",
  "Apartment",
  "Studio",
  "Bungalow",
  "Land"
]);

const FurnishedTypeEnum = z.enum(["Furnished", "PartFurnished", "Unfurnished"]);

export const createPropertySchema = z.object({
  title: z.string().min(1, "Title is required"),

  desc: z.string().min(1, "Description is required"),
  address: z.string().min(1, "Address is required"),
  postcode: z.string().min(1, "Postcode is required"),
  city: z.string().min(1, "City is required"),
  bedroom: z.string().min(1, "Bedroom number must be at least 1").optional(),
  bathroom: z.string().min(1, "Bathroom number must be at least 1").optional(),
  price: z.string().min(1, "Price is required"),
  size: z.string().min(1, "Size is required").optional(),
  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),
  listingType: ListingTypeEnum,
  propertyType: PropertyTypeEnum,
  furnishedType: FurnishedTypeEnum.optional(),
  pet: z.boolean().optional(),
  garden: z.boolean().optional(),
  balcony: z.boolean().optional(),
  parking: z.boolean().optional(),

  images: z
    .array(
      z.instanceof(File).or(
        z
          .string()
          .min(1)
          .transform((value) => (value === "" ? undefined : value))
      )
    )
    .nonempty("At least one image is required")
});

export const editPropertySchema = z.object({
  title: z.string().min(1, "Title is required").optional(),

  desc: z.string().min(1, "Description is required").optional(),
  address: z.string().min(1, "Address is required").optional(),
  postcode: z.string().min(1, "Postcode is required").optional(),
  city: z.string().min(1, "City is required").optional(),
  bedroom: z.string().min(1, "Bedroom number must be at least 1").optional(),
  bathroom: z.string().min(1, "Bathroom number must be at least 1").optional(),
  price: z.string().min(1, "Price is required").optional(),
  size: z.string().min(1, "Size is required").optional(),
  latitude: z.string().min(1, "Latitude is required").optional(),
  longitude: z.string().min(1, "Longitude is required").optional(),
  listingType: ListingTypeEnum.optional(),
  propertyType: PropertyTypeEnum.optional(),
  furnishedType: FurnishedTypeEnum.optional(),
  pet: z.boolean().optional(),
  garden: z.boolean().optional(),
  balcony: z.boolean().optional(),
  parking: z.boolean().optional(),

  images: z
    .array(
      z.instanceof(File).or(
        z
          .string()
          .min(1)
          .transform((value) => (value === "" ? undefined : value))
      )
    )
    .nonempty("At least one image is required")
    .optional()
});
