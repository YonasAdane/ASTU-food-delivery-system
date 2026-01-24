const express = require("express");
const protect = require("../middlewares/auth.middleware"); 
const restrictTo = require("../middlewares/restrictTo")
const {
    registerDriver,
    driverOrders,
    currentLocation,
    getCurrentLocation,
    changeDriverStatus,
    dailyAndTotalEarning
} = require("../controllers/driver.controller");
const router = express.Router();


module.exports = router;
