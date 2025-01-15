import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import passport from "passport";

import prisma from "@/lib/prisma";

import authRoute from "@/routes/auth.route";
import userRoute from "@/routes/user.route";
import propertyRoute from "@/routes/property.route";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const port = process.env.PORT || 8000;

app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL!,
    credentials: true
  })
);
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app
  .use("/api/auth", authRoute)
  .use("/api/users", userRoute)
  .use("/api/properties", propertyRoute);

const start = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to Database");

    app.listen(port, () => {
      console.log(`[server]: Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to Database: ", error);
    process.exit(1);
  }
};

start();
