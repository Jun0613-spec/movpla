import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { User } from "@prisma/client";
import prisma from "@/lib/prisma";

import { generateAccessToken, generateRefreshToken } from "@/utils/helper";
import { Request, Response } from "express";
import axios from "axios";
import { uploadImage, uploadImageFromUrl } from "@/utils/upload-image";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = `${process.env.SERVER_URL}/api/auth/callback/google`;
const CLIENT_URL = process.env.CLIENT_URL!;

passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: REDIRECT_URI,
      scope: ["openid", "profile", "email"]
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = profile._json;

        let existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        if (!user.email || !user.name)
          return done(
            new Error("Missing essential user information from Google")
          );

        if (!existingUser) {
          existingUser = await prisma.user.create({
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
          avatarImageUrl = await uploadImageFromUrl(avatarImageUrl);
        }

        existingUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: { avatarImage: avatarImageUrl }
        });

        const jwtAccessToken = generateAccessToken(existingUser.id);
        const jwtRefreshToken = generateRefreshToken(existingUser.id);

        // Return user along with the JWT tokens
        return done(null, {
          user: existingUser,
          accessToken: jwtAccessToken,
          refreshToken: jwtRefreshToken
        });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export const googleLogin = passport.authenticate("google", {
  scope: ["openid", "profile", "email"]
});

export const googleCallback = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { user, accessToken, refreshToken } = req.user as {
      user: User;
      accessToken: string;
      refreshToken: string;
    };

    await prisma.refreshToken.create({
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

    const googleCallbackUrl = `${CLIENT_URL}/google/callback?token=${accessToken}&user=${encodeURIComponent(
      JSON.stringify(user)
    )}`;

    res.redirect(googleCallbackUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: User, done) => {
  done(null, user);
});
