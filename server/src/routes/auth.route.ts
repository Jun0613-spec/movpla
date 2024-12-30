import express from "express";
import { body } from "express-validator";

import {
  currentUser,
  login,
  logout,
  refreshToken,
  register
} from "@/controllers/auth.controller";

import { verifyToken } from "@/middleware/verify-token";

import { loginValidator, registerValidator } from "@/utils/validator";
import { googleCallback, googleLogin } from "@/controllers/oauth.controller";

import passport from "passport";

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/current-user", verifyToken, currentUser);

router.get("/google", googleLogin);
router.get(
  "/callback/google",
  passport.authenticate("google", { session: false }),
  googleCallback
);

export default router;
