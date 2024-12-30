import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import passport from "passport";
import http from "http";
import { Server } from "socket.io";

import prisma from "@/lib/prisma";

import authRoute from "@/routes/auth.route";
import userRoute from "@/routes/user.route";
import propertyRoute from "@/routes/property.route";
import chatRoute from "@/routes/chat.route";
import messageRoute from "@/routes/message.route";

import { initializeSocket } from "./socket/socket";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL!,

    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
});

initializeSocket(io);

app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.CLIENT_URL!, "http://localhost:3001"],
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

app.get("/socket-health", (req: Request, res: Response) => {
  res.status(200).send("Socket.io is running");
});

app
  .use("/api/auth", authRoute)
  .use("/api/users", userRoute)
  .use("/api/properties", propertyRoute)
  .use("/api/chats", chatRoute)
  .use("/api/messages", messageRoute);

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
