const express = require("express");
const validate = require("../middlewares/validate");
const {
  registerUserSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validators/userValidator");

const {
  register,
  login,
  verifyEmail,
  refreshToken,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

const router = express.Router();
router.post("/register", validate(registerUserSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/verify-email/:token", verifyEmail);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password/:token", validate(resetPasswordSchema), resetPassword);
module.exports = router;
