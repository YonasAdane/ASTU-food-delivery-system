const Cart = require("../models/Cart");
const Restaurant = require("../models/Restaurant");
const { checkCache } = require("../utils/cache");
const { client: redisClient } = require("../config/redis");
const logger = require("../utils/logger");

exports.addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity, restaurantId } = req.body;
    
    // 1. Validate Restaurant
    const restaurant = await Restaurant.findOne({ _id: restaurantId, deleted: false });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    // 2. Validate Menu Item
    const menuItem = restaurant.menu.id(menuItemId);
    if (!menuItem || !menuItem.inStock) {
      return res.status(404).json({ message: "Menu item not found or unavailable" });
    }

    // 3. Find Customer's Cart
    let cart = await Cart.findOne({ customerId: req.user._id });

    // === CONFLICT CHECK LOGIC ===
    if (cart && cart.restaurantId.toString() !== restaurantId) {
      // Find the name of the restaurant currently occupying the cart
      const currentRestaurant = await Restaurant.findById(cart.restaurantId);
      
      // Return 409 (Conflict) with details
      return res.status(409).json({ 
        message: "Cart conflict",
        errorType: "RESTAURANT_CONFLICT",
        currentRestaurantName: currentRestaurant ? currentRestaurant.name : "another restaurant",
        currentRestaurantId: cart.restaurantId // Needed to delete the old cart
      });
    }

    // 4. Initialize Cart if none exists
    if (!cart) {
      cart = new Cart({
        customerId: req.user._id,
        restaurantId,
        items: [],
        total: 0,
      });
    }

    // 5. Add or Update Item
    const existingItem = cart.items.find(
      (item) => item.menuItemId.toString() === menuItemId
    );

    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      cart.items.push({
        menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
      });
    }

    // 6. Recalculate Total & Save
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    
    // Invalidate Redis Cache
    await redisClient.del(`cart:${req.user._id}`);

    res.status(201).json({ message: "success", data: cart });
  } catch (err) {
    logger.error(`Error adding to cart: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(id);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    item.quantity = quantity;
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    await cart.save();
    await redisClient.del(`cart:${req.user._id}`);
    res.status(200).json({ message: "success", data: cart });
  } catch (err) {
    logger.error(`Error updating cart item: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { restaurantId } = req.params;

    const cart = await Cart.findOneAndDelete({ customerId, restaurantId });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found for this restaurant" });
    }

    return res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting cart: ${error.message}`);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(id);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    cart.items.pull(id);
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    await redisClient.del(`cart:${req.user._id}`);
    res.status(200).json({ message: "success", data: cart });
  } catch (err) {
    logger.error(`Error removing item from cart: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cacheKey = `cart:${req.user._id}`;
    const cached = await checkCache(cacheKey);
    if (cached) {
      return res.status(200).json({ message: "success", data: cached });
    }

    const cart = await Cart.findOne({ customerId: req.user._id }).populate(
      "restaurantId",
      "name"
    );
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    await redisClient.setEx(cacheKey, 300, JSON.stringify(cart));
    res.status(200).json({ message: "success", data: cart });
  } catch (err) {
    logger.error(`Error fetching cart: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
