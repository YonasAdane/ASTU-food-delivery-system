const express = require("express");
const passport = require("passport");
const validate = require("../middlewares/validate");
const {
  registerUserSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validators/userValidator");

const {
  googleCallback,
  register,
  login,
  verifyEmail,
  refreshToken,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect:
      (process.env.CLIENT_URL || "http://localhost:3000") +
      "/login?error=google",
  }),
  googleCallback,
);

router.post("/register", validate(registerUserSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/verify-email/:token", verifyEmail);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  resetPassword,
);
module.exports = router;
