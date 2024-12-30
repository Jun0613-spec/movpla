import axios from "axios";
import cloudinary from "cloudinary";

export const uploadImages = async (imageFiles: Express.Multer.File[]) => {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");

    let dataURI = "data:" + image.mimetype + ";base64," + b64;

    const res = await cloudinary.v2.uploader.upload(dataURI);

    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);

  return imageUrls;
};

export const uploadImage = async (imageFile: Express.Multer.File) => {
  const b64 = Buffer.from(imageFile.buffer).toString("base64");

  let dataURI = "data:" + imageFile.mimetype + ";base64," + b64;

  const res = await cloudinary.v2.uploader.upload(dataURI);

  return res.url;
};

export const uploadImageFromUrl = async (imageUrl: string): Promise<string> => {
  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer"
    });

    const b64 = Buffer.from(response.data).toString("base64");
    const dataURI = `data:image/jpeg;base64,${b64}`;

    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};
