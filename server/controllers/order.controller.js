const Cart = require("../models/Cart");
const Joi = require("joi");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const { client: redisClient } = require("../config/redis");
const logger = require("../utils/logger");

exports.createOrder = async (req, res) => {
  try {
    const { deliveryLocation, paymentMethod,note } = req.body;
    const cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart)
      return res.status(404).json({ message: "Cart is empty or not found" });

    const restaurant = await Restaurant.findOne({
      _id: cart.restaurantId,
    });
    logger.info("Cart items:", cart.items, "Total:", cart.total);

    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    for (const item of cart.items) {
      const menuItem = restaurant.menu.id(item.menuItemId);
      if (!menuItem || !menuItem.inStock || menuItem.price !== item.price) {
        return res.status(400).json({
          message: `Menu item ${item.name} is unavailable or price is changed`,
        });
      }
    }
    let total = cart.total;
    if (!total) {
      total = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }
    const order = new Order({
      customerId: req.user._id,
      restaurantId: cart.restaurantId,
      items: cart.items,
      total,
      deliveryLocation,
      paymentMethod,
      status: "pending",
      note : note,
    });

    await order.save();
    await Cart.deleteOne({ customerId: req.user._id }); // clear cart
    await redisClient.del(`cart:${req.user._id}`);
    // await redisClient.del(`orders:${cart.restaurantId}`);
    res.status(200).json({ message: "success", data: order });
  } catch (err) {
    logger.error(`Error creating the order: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};


const orderQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid("pending", "accepted", "preparing", "ready", "picked", "en_route", "delivered", "canceled", "all").default("all"),
  sortBy: Joi.string().valid("date_desc", "date_asc", "price_high", "price_low").default("date_desc"),
});

exports.getOrderHistory = async (req, res) => {
  try {
    const { error, value } = orderQuerySchema.validate(req.query, {
      abortEarly: false,
    });
    
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((err) => err.message),
      });
    }

    const { page, limit, status, sortBy } = value;
    const skip = (page - 1) * limit;
    const userID = req.user.id;
    const role = req.user.role;

    // 1. Base Query
    let query = {};
    if (role === "customer") query.customerId = userID;
    else if (role === "restaurant") query.restaurantId = userID;
    else if (role === "driver") query.driverId = userID;

    // 2. Apply Filters
    if (status && status !== "all") {
      query.status = status;
    }

    // 3. Apply Sorting
    let sortOptions = { createdAt: -1 }; // Default: Newest first
    if (sortBy === "date_asc") sortOptions = { createdAt: 1 };
    if (sortBy === "price_high") sortOptions = { total: -1 };
    if (sortBy === "price_low") sortOptions = { total: 1 };

    // 4. Execute Query
    const orders = await Order.find(query)
      .select("customerId restaurantId items total status deliveryLocation paymentMethod createdAt updatedAt")
      .populate("customerId", "name email")
      .populate("restaurantId", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalDocs = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    res.status(200).json({
      message: "Orders retrieved successfully",
      data: { 
        orders, 
        pagination: {
          totalDocs,
          totalPages,
          currentPage: page,
          limit
        }
      },
    });
  } catch (err) {
    logger.error(`Error fetching orders: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changeOrderStatus = async (req, res) => {
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

    const order = await Order.findOne({
      _id: orderId,
    });
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or unauthorized" });
    }

    order.status = status;
    await order.save();

    // socket later

    res.status(200).json({ message: "Order status updated", data: order });
  } catch (err) {
    logger.error(`Error changing order status: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

exports.storeFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.customerId.toString() !== req.user._id.toString()) {
      throw new Error(
        "Forbidden: You can only provide feedback for your own orders"
      );
    }

    if (order.status !== "delivered") {
      throw new Error("Feedback can only be provided for delivered orders");
    }

    order.rating = rating;
    order.feedback = comment;
    await order.save();

    res.status(200).json({ message: "success", data: order });
  } catch (err) {
    logger.error(`Error storing feedback: ${err.message}`);
    res.status(500).json({ messge: "Server error" });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;


    const order = await Order.findById(id)
      .populate("restaurantId", "name location phone address") 
      .populate("driverId", "name phone") 
      .populate("customerId", "name phone email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ status: "success", data: order });
  } catch (err) {
    logger.error(`Error fetching order details: ${err.message}`);
    
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: "Order not found" });
    }
    
    res.status(500).json({ message: "Server error" });
  }
};

