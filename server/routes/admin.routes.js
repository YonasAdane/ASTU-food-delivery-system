const express = require("express");
const {
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
  getDashboard,
} = require("../controllers/admin.controller");
const protect = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/restrictTo");

const router = express.Router();

router.get("/users", protect, restrictTo("admin"), getAllUsers);
router.post("/users/roles", protect, restrictTo("admin"), getUserByRoles);
router.get("/restaurants/pending", protect, restrictTo("admin"), pendingRestaurant);
router.patch("/restaurants/:id/verify", protect, restrictTo("admin"), verifyRestaurant);
router.patch("/restaurants/:id/reject", protect, restrictTo("admin"), rejectRestaurant);
router.get("/restaurants", protect, restrictTo("admin"), getAllRestaurants);
// Dashboard metrics (internal/public proxy) - does not require admin auth so internal services can fetch it
router.get("/dashboard", getDashboard);
router.get("/stats", protect, restrictTo("admin"), getPlatformStats);
router.patch("/users/:id/suspend", protect, restrictTo("admin"), suspendUser);
router.get("/orders/complaints", protect, restrictTo("admin"), getComplaints);
router.patch(
  "/orders/:id/resolve",
  protect,
  restrictTo("admin"),
  resolveComplaint
);

// NEW: Order routes for admin
router.get("/orders", protect, restrictTo("admin"), getAllOrders);  // New route
router.patch("/orders/:orderId/status", protect, restrictTo("admin"), updateOrderStatus);  // New route

// User management routes
router.patch("/users/:id", protect, restrictTo("admin"), updateUser);
router.delete("/users/:id", protect, restrictTo("admin"), deleteUser);
router.patch("/users/:id/restore", protect, restrictTo("admin"), restoreUser);
router.patch("/users/:id/verify", protect, restrictTo("admin"), verifyUser);
router.post("/users/:id/reset-password", protect, restrictTo("admin"), resetUserPassword);
router.patch("/users/:id/invalidate-sessions", protect, restrictTo("admin"), invalidateUserSessions);

module.exports = router;
