const mongoose = require("mongoose");
const Joi = require("joi");
const Restaurant = require("../models/Restaurant");
const User = require("../models/Users");
const Order = require("../models/Order");
const logger = require("../utils/logger");

const userRoleSchema = Joi.object({
  role: Joi.string()
    .valid("customer", "restaurant", "driver", "admin")
    .optional()
    .messages({
      "string.valid":
        "Role must be one of: customer, admin, restaurant, driver",
    }),
});

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({ restaurants });
  } catch (err) {
    logger.err(`Error fetching restaurants: ${err.message}`);
    res.status(500).json({ message: "Error fetching users", err });
  }
};

const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenue = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);

    res.status(200).json({
      totalUsers,
      totalRestaurants,
      totalOrders,
      totalRevenue: revenue[0]?.totalRevenue || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats", err });
  }
};

// Admin: Get pending restaurants
const pendingRestaurant = async (req, res) => {
  try {
    const pending = await Restaurant.find({ verified: false, deleted: false });
    if (!pending.length)
      return res.status(404).json({ message: "No pending restaurants found" });
    res.status(200).json({ status: "success", data: { pending } });
    console.log(`Fetched pending restaurants: ${pending.length}`);
  } catch (error) {
    logger.error("Error fetching pending restaurants:", error);
    res.status(500).json({ message: "Failed to fetch pending restaurants" });
  }
};

// Admin: Verify restaurant
const verifyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    restaurant.verified = true;
    await restaurant.save();

    res.status(200).json({ message: "Restaurant verified successfully" });
  } catch (error) {
    logger.error("Error verifying restaurant:", error);
    res.status(500).json({ message: "Failed to verify restaurant" });
  }
};

const rejectRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { verified: false },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    res.json({ message: "Restaurant rejected successfully", restaurant });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
    logger.error("Error verifying restaurant", err.message);
  }
};
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      status,
      isVerified,
    } = req.query;

    const query = {
      deleted: false,
    };

    // 🔍 Search (email or phone)
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // 🎯 Filters
    if (role) query.role = role;
    if (status) query.status = status;
    if (isVerified !== undefined)
      query.isVerified = isVerified === "true";

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password -refreshToken -verificationToken")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),

      User.countDocuments(query),
    ]);

    // if (!users.length) {
    //   return res.status(404).json({ message: "No users found" });
    // }

    res.status(200).json({
      data: users,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserByRoles = async (req, res) => {
  try {
    const { error, value } = userRoleSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((err) => err.message),
      });
    }

    const { role } = value;

    const query = role ? { role } : {};
    logger.info(`Fetching users with query: ${JSON.stringify(query)}`);

    const users = await User.find(query).select("-password");
    const count = users.length;

    if (count === 0) {
      return res
        .status(400)
        .json({ message: "No users found for the specified role" });
    }

    res.status(200).json({
      message: "Users fetched successfully",
      data: { count, users },
    });
  } catch (err) {
    logger.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    id = id.replace(/['"]+/g, "");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.set("suspendStatus", true, { strict: false }); 

    res.status(200).json({ message: "success", data: user });
  } catch (err) {
    logger.error(`Error suspending the user: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData.resetPasswordToken;
    delete updateData.resetPasswordExpires;
    delete updateData.verificationToken;
    
    // Check if role is changing from driver to non-driver
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (existingUser.role === "driver" && updateData.role && updateData.role !== "driver") {
      // Clear driver-specific fields
      updateData.restaurantId = undefined;
      updateData.status = undefined;
    }
    
    // If changing to driver role, ensure required fields are present
    if (updateData.role === "driver" && existingUser.role !== "driver") {
      if (!updateData.restaurantId) {
        return res.status(400).json({ message: "Restaurant ID is required for driver role" });
      }
      if (!updateData.status) {
        return res.status(400).json({ message: "Status is required for driver role" });
      }
    }
    
    // Validate restaurant exists if assigning to driver
    if ((existingUser.role === "driver" || updateData.role === "driver") && updateData.restaurantId) {
      const restaurant = await Restaurant.findById(updateData.restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select("-password -refreshToken -verificationToken -resetPasswordToken");
    
    res.status(200).json({ message: "User updated successfully", data: updatedUser });
  } catch (err) {
    logger.error(`Error updating user: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { deleted: true, deletedAt: new Date(), updatedAt: new Date() },
      { new: true }
    ).select("-password -refreshToken -verificationToken -resetPasswordToken");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User soft deleted successfully", data: user });
  } catch (err) {
    logger.error(`Error soft deleting user: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const restoreUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { deleted: false, deletedAt: undefined, updatedAt: new Date() },
      { new: true }
    ).select("-password -refreshToken -verificationToken -resetPasswordToken");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User restored successfully", data: user });
  } catch (err) {
    logger.error(`Error restoring user: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { verify } = req.body; // true to verify, false to unverify
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { isVerified: Boolean(verify), updatedAt: new Date() },
      { new: true }
    ).select("-password -refreshToken -verificationToken -resetPasswordToken");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const action = verify ? "verified" : "unverified";
    res.status(200).json({ message: `User ${action} successfully`, data: user });
  } catch (err) {
    logger.error(`Error verifying user: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Generate reset token
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();
    
    // In a real app, you would send an email here
    // For now, we'll just return the token (in production, never return the token)
    res.status(200).json({ message: "Password reset initiated successfully" });
  } catch (err) {
    logger.error(`Error resetting user password: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const invalidateUserSessions = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { refreshToken: undefined, updatedAt: new Date() },
      { new: true }
    ).select("-password -refreshToken -verificationToken -resetPasswordToken");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User sessions invalidated successfully", data: user });
  } catch (err) {
    logger.error(`Error invalidating user sessions: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const getComplaints = async (req, res) => {
  try {
    const complaints = await Order.find({
      feedback: { $exists: true, $ne: null },
      rating: { $lt: 3 },
    })
      .select("customerId restaurantId rating feedback createdAt")
      .populate("customerId", "email")
      .populate("restaurantId", "name");
    if (!complaints.length) throw new Error("No complaints found");

    res.status(200).json({ message: "success", data: complaints });
  } catch (err) {
    logger.error("Error fetching complaints:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) throw new Error("Order not found");

    order.resolved = true; // 'resolved' will be added
    await order.save();
    res.status(200).json({ message: "success", data: order });
  } catch (err) {
    logger.error("Error resolving complaint:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      restaurantId,
      driverId,
      customerId,
      paymentMethod,
      dateFrom,
      dateTo,
      hasComplaints, // Orders with complaints (low rating or feedback)
    } = req.query;

    const query = { deleted: false }; // Only non-deleted orders

    // Search by Order ID, customer email, or phone
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { _id: { $regex: searchRegex } }, // Order ID
        { 'customerId.email': { $regex: searchRegex } }, // Customer email
        { 'customerId.phone': { $regex: searchRegex } }, // Customer phone
        { 'restaurantId.name': { $regex: searchRegex } }, // Restaurant name
      ];
    }

    // Filters
    if (status) query.status = status;
    if (restaurantId) query.restaurantId = restaurantId;
    if (driverId) query.driverId = driverId;
    if (customerId) query.customerId = customerId;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Filter for orders with complaints (low rating or feedback)
    if (hasComplaints === 'true') {
      query.$or = [
        { rating: { $lt: 3 } },
        { feedback: { $exists: true, $ne: null, $ne: '' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Populate with more detailed information
    const orders = await Order.find(query)
      .populate('customerId', 'email phone name')
      .populate('restaurantId', 'name email phone')
      .populate('driverId', 'email phone name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
        data:orders,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit),
        },
      }
    );
  } catch (err) {
    logger.error("Error fetching orders:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "accepted",
      "preparing",
      "ready",
      "picked",
      "en_route",
      "delivered",
      "canceled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", data: order });
  } catch (err) {
    logger.error(`Error updating order status: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  pendingRestaurant,
  verifyRestaurant,
  rejectRestaurant,
  getUserByRoles,
  getAllRestaurants,
  getPlatformStats,
  suspendUser,
  getComplaints,
  resolveComplaint,
  updateUser,
  deleteUser,
  restoreUser,
  verifyUser,
  resetUserPassword,
  invalidateUserSessions,
  getAllOrders,
  updateOrderStatus,
};
