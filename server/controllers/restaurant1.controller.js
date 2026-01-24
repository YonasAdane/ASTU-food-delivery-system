const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");
const logger = require("../utils/logger");
const User = require("../models/Users");
const Order = require("../models/Order");
const { client: redisClient } = require("../config/redis");
const { sendOTP } = require("../utils/afroMessage");
// Helper to check ownership
const checkOwnership = (restaurant, user) => {
  if (!restaurant.ownerId.equals(user._id)) {
    return false;
  }
  return true;
};

// Get all verified, non-deleted restaurants
// Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });

    if (req.user.role !== "admin" && !checkOwnership(restaurant, req.user)) {
      return res
        .status(403)
        .json({ error: "Forbidden: You are not the owner" });
    }

    restaurant.menu = restaurant.menu.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await restaurant.save();
    res.json({ message: "Menu item removed", menu: restaurant.menu });
  } catch (err) {
    logger.error("Failed to remove menu item:", err);
    res.status(500).json({ error: "Failed to remove menu item" });
  }
};

// Update menu item
const updateMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });

    if (!checkOwnership(restaurant, req.user)) {
      return res
        .status(403)
        .json({ error: "Forbidden: You are not the owner" });
    }

    const menuItem = restaurant.menu.id(req.params.itemId);
    if (!menuItem)
      return res.status(404).json({ error: "Menu item not found" });

    const { name, price, description, image, inStock } = req.body;
    if (name !== undefined) menuItem.name = name;
    if (price !== undefined) menuItem.price = price;
    if (description !== undefined) menuItem.description = description;
    if (image !== undefined) menuItem.image = image;
    if (inStock !== undefined) menuItem.inStock = inStock;

    await restaurant.save();
    res.json({ success: true, updatedItem: menuItem });
  } catch (err) {
    logger.error("Update error:", err);
    res.status(500).json({ error: "Server error during update" });
  }
};
// Register restaurant (creates user + restaurant)
const registerRestaurant = async (req, res) => {
  try {
    const {
      email,
      phone,
      password,
      name,
      image,
      area,
      deliveryTime,
      latitude,
      longitude
    } = req.body;

    // Validation (important)
    if (
      !area ||
      !deliveryTime ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        message:
          "area, deliveryTime, latitude and longitude are required"
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Restaurant already exists" });
    }

    const user = await User.create({
      email,
      phone,
      password,
      role: "restaurant"
    });

    const restaurant = await Restaurant.create({
      name,
      ownerId: user._id,
      image,
      area,
      deliveryTime,
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)] // IMPORTANT ORDER
      }
    });

    res.status(201).json({
      status: "success",
      data: { restaurant }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get restaurant menu
const getMenus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });

    res.status(200).json(restaurant.menu);
  } catch (err) {
    logger.error("Failed to fetch menu:", err);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
};
const getMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }