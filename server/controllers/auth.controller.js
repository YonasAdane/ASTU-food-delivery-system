const User = require("../models/Users");
const { generateToken, refreshToken } = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const { sendOTP, verifyOTP } = require("../utils/afroMessage");
const { client: redisClient } = require("../config/redis");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const { ref } = require("joi");

exports.register = async (req, res) => {
  try {
    const { email, phone, password, restaurantId, role } = req.body;
    const userExist = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExist)
      return res.status(400).json({ message: "User already exists" });

    const verificationToken = crypto.randomBytes(20).toString("hex");

    const user = await User.create({
      email,
      phone,
      password,
      restaurantId,
      role,
      verificationToken,
    });

    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/verify-email/${verificationToken}`; // This should ideally be the client URL, not the API URL directly if we want a frontend page. 
    // BUT the requirement says "integrate in frontend", so the link should point to frontend page.
    // Frontend URL: http://localhost:3000/verify-email?token=...
    
    // Let's assume CLIENT_URL or fallback to localhost:3000
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const frontendVerificationUrl = `${clientUrl}/verify-email/${verificationToken}`;

    const message = `Please click on the link below to verify your email address:\n\n${frontendVerificationUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Email Verification",
        message,
      });
    } catch (error) {
      console.log("Email sending failed:", error);
        user.verificationToken = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ message: "Email could not be sent" });
    }

    res.status(200).json({
      status: "success",
      message: "Verification email sent successfully",
      data: { userid: user._id, role: user.role },
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token: verificationToken } = req.params;

    // Use direct query since we stored hex string directly
    const user = await User.findOne({ 
      verificationToken
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    const token = generateToken(user);
    const refreshTokenn = refreshToken(user);
    
    await User.updateOne({ _id: user._id }, { refreshToken: refreshTokenn });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie("refreshToken", refreshTokenn, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res
      .status(200)
      .json({ status: "success", data: { userId: user._id, role: user.role } });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Find user by email or phone
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({ phone });
    }

    // If no user found or password doesn't match
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If phone not verified, send OTP and stop login process
    if (!user.isVerified) {
       return res.status(403).json({
        message: "Please verify your email first.",
      });
    }

    // Generate tokens
    const token = generateToken(user);
    const refreshTokenValue = refreshToken(user);

    // Save refresh token in DB
    await User.updateOne(
      { _id: user._id },
      { refreshToken: refreshTokenValue }
    );

    // Set cookies
    // Set cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
    });

    res.cookie("refreshToken", refreshTokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
    });

    // Prepare response data
    let responseData = { userId: user._id, role: user.role };

    // If restaurant, fetch restaurantId
    if (user.role === "restaurant") {
      const restaurant = await require("../models/Restaurant").findOne({
        ownerId: user._id,
      });
      if (restaurant) {
        responseData.restaurantId = restaurant._id;
      }
    }

    // Send success response
    res.status(200).json({
      token,
      status: "success",
      data: responseData,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Fetch full user, not just refreshToken
    const user = await User.findOne({ _id: decoded.id });
    if (!user)
      return res.status(401).json({ message: "Invalid refresh token" });

    // Prepare response
    let responseData = { userId: user._id, role: user.role };
    if (user.role === "restaurant") {
      const restaurant = await require("../models/Restaurant").findOne({ ownerId: user._id });
      if (restaurant) responseData.restaurantId = restaurant._id;
    }

    generateToken(user); // optional: generate a new access token
    res.status(200).json({ status: "success", data: responseData });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Invalid refresh token" });
  }
};
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "User with given email doesn't exist" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`; 

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message
        });

        res.status(200).json({ status: "success", message: "Email sent" });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    // Find user with token and check expiry
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};
