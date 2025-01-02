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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cloudinary_1 = require("cloudinary");
const passport_1 = __importDefault(require("passport"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const prisma_1 = __importDefault(require("./lib/prisma"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const property_route_1 = __importDefault(require("./routes/property.route"));
const chat_route_1 = __importDefault(require("./routes/chat.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const socket_1 = require("./socket/socket");
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const port = process.env.PORT || 8000;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [process.env.CLIENT_URL, "http://localhost:3001"],
        methods: ["GET", "POST"],
        credentials: true
    }
});
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
});
(0, socket_1.initializeSocket)(io);
app.use(passport_1.default.initialize());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [process.env.CLIENT_URL, "http://localhost:3001"],
    credentials: true
}));
app.use(helmet_1.default.crossOriginResourcePolicy({
    policy: "cross-origin"
}));
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.get("/", (req, res) => {
    res.send("Hello world");
});
app.get("/socket-health", (req, res) => {
    res.status(200).send("Socket.io is running");
});
app
    .use("/api/auth", auth_route_1.default)
    .use("/api/users", user_route_1.default)
    .use("/api/properties", property_route_1.default)
    .use("/api/chats", chat_route_1.default)
    .use("/api/messages", message_route_1.default);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.$connect();
        console.log("Connected to Database");
        app.listen(port, () => {
            console.log(`[server]: Server is running on http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("Failed to connect to Database: ", error);
        process.exit(1);
    }
});
start();
