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
exports.googleCallback = exports.googleLogin = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const prisma_1 = __importDefault(require("../lib/prisma"));
const helper_1 = require("../utils/helper");
const upload_image_1 = require("../utils/upload-image");
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.SERVER_URL}/api/auth/callback/google`;
const CLIENT_URL = process.env.CLIENT_URL;
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: REDIRECT_URI,
    scope: ["openid", "profile", "email"]
}, (_accessToken, _refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = profile._json;
        let existingUser = yield prisma_1.default.user.findUnique({
            where: { email: user.email }
        });
        if (!user.email || !user.name)
            return done(new Error("Missing essential user information from Google"));
        if (!existingUser) {
            existingUser = yield prisma_1.default.user.create({
                data: {
                    email: user.email,
                    username: user.name,
                    firstName: user.given_name,
                    lastName: user.family_name,
                    googleId: user.sub,
                    avatarImage: user.picture
                }
            });
        }
        let avatarImageUrl = user.picture || "";
        if (avatarImageUrl) {
            avatarImageUrl = yield (0, upload_image_1.uploadImageFromUrl)(avatarImageUrl);
        }
        existingUser = yield prisma_1.default.user.update({
            where: { id: existingUser.id },
            data: { avatarImage: avatarImageUrl }
        });
        const jwtAccessToken = (0, helper_1.generateAccessToken)(existingUser.id);
        const jwtRefreshToken = (0, helper_1.generateRefreshToken)(existingUser.id);
        // Return user along with the JWT tokens
        return done(null, {
            user: existingUser,
            accessToken: jwtAccessToken,
            refreshToken: jwtRefreshToken
        });
    }
    catch (error) {
        return done(error, false);
    }
})));
exports.googleLogin = passport_1.default.authenticate("google", {
    scope: ["openid", "profile", "email"]
});
const googleCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, accessToken, refreshToken } = req.user;
        yield prisma_1.default.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id
            }
        });
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        const googleCallbackUrl = `${CLIENT_URL}/google/callback?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(user))}`;
        res.redirect(googleCallbackUrl);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Authentication failed" });
    }
});
exports.googleCallback = googleCallback;
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
