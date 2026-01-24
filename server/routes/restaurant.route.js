const express = require("express");
const protect = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/restrictTo");
const Restaurant = require("../models/Restaurant");

const router = express.Router();

const {
  getAllRestaurants,
  getRestaurantById,
  addMenuItem,
  deleteMenuItem,
  updateMenuItem,
  registerRestaurant,
  getMenus,
  getMenuItem,
  updateInventory,
  restaurantStats,
  getAllOrder,
  getOrderById,
  inviteDriver,
  assignDriverToOrder,
  activeDrivers,
  restaurantOrderStat,
} = require("../controllers/restaurant.controller");

/* =========================================================
   AUTH / OWNER-SPECIFIC ROUTES (MUST COME FIRST)
   ========================================================= */

/**
 * GET logged-in restaurant (owner only)
 * Uses HttpOnly cookie + JWT
 */
router.get(
  "/me",
  protect,
  restrictTo("restaurant"),
  async (req, res) => {
    try {
      const restaurant = await Restaurant.findOne({
        ownerId: req.user._id,
      });

      if (!restaurant) {
        return res
          .status(404)
          .json({ message: "Restaurant not found" });
      }

      res.json({ restaurant });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* =========================================================
   PUBLIC / GENERAL ROUTES
   ========================================================= */

router.post("/register", registerRestaurant);

/**
 * Get all restaurants (protected)
 * Used for customers, admin, listings
 */
router.get("/", protect, getAllRestaurants);

/**
 * Get restaurant by ID
 */
router.get("/:id", protect, getRestaurantById);

/* =========================================================
   MENU ROUTES
   ========================================================= */

router.get("/:restaurantId/menu", protect, getMenus);

router.get("/:restaurantId/menu/:itemId", protect, getMenuItem);

router.post(
  "/:restaurantId/menu",
  protect,
  restrictTo("restaurant"),
  addMenuItem
);

router.put(
  "/:restaurantId/menu/:itemId",
  protect,
  restrictTo("restaurant"),
  updateMenuItem
);

router.delete(
  "/:restaurantId/menu/:itemId",
  protect,
  restrictTo("restaurant", "admin"),
  deleteMenuItem
);

/* =========================================================
   INVENTORY
   ========================================================= */

router.put(
  "/:restaurantId/inventory",
  protect,
  restrictTo("restaurant"),
  updateInventory
);

/* =========================================================
   STATS
   ========================================================= */

router.get(
  "/:restaurantId/stats",
  protect,
  restrictTo("restaurant", "admin"),
  restaurantStats
);

router.get(
  "/:restaurantId/order-stats",
  protect,
  restrictTo("restaurant", "admin"),
  restaurantOrderStat
);

/* =========================================================
   ORDERS
   ========================================================= */

router.get(
  "/:restaurantId/orders",
  protect,
  restrictTo("restaurant", "admin"),
  getAllOrder
);

router.get(
  "/:restaurantId/orders/:orderId",
  protect,
  restrictTo("restaurant", "admin"),
  getOrderById
);

/* =========================================================
   DRIVERS
   ========================================================= */

router.post(
  "/invite-driver",
  protect,
  restrictTo("restaurant"),
  inviteDriver
);

router.post(
  "/assign-driver",
  protect,
  restrictTo("restaurant"),
  assignDriverToOrder
);

router.get(
  "/:restaurantId/active-drivers",
  protect,
  restrictTo("restaurant"),
  activeDrivers
);

module.exports = router;
