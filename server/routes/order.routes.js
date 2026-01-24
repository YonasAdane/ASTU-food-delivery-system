const express = require("express");
const {
  createOrder,
  getOrderHistory,
  changeOrderStatus,
  storeFeedback,
  getOrderById // This function comes from the 'beki.b' branch
} = require("../controllers/order.controller");
const {
  validateFeedback, // This validator comes from the 'beki.b' branch
} = require("../validators/orderValidator");
const protect = require("../middlewares/auth.middleware.js");
const restrictTo = require("../middlewares/restrictTo");

const router = express.Router();

router.post(
  "/",
  protect, // Keep active as per the 'main' branch's intention
  restrictTo("customer", "restaurant", "admin"), // Keep active as per the 'main' branch's intention
  createOrder
);

router.get(
  "/all",
  protect,
  restrictTo("customer", "restaurant", "admin"),
  getOrderHistory
);

router.post(
  "/:orderId/status",
  protect,
  restrictTo("restaurant", "admin", "driver"),
  changeOrderStatus
);

router.post(
  "/:id/feedback",
  protect,
  restrictTo("customer"),
  validateFeedback,
  storeFeedback
);
router.get(
  "/:id",
  protect,
  restrictTo("customer", "restaurant", "admin", "driver"),
  getOrderById
);
module.exports = router;