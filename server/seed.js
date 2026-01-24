require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const Restaurant = require("./models/Restaurant");
const User = require("./models/Users");
const logger = require("./utils/logger");
const connectDB = require("./config/db");

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+?\d{10,15}$/).required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("restaurant").required(),
});

const restaurantSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }).required(),
  area: Joi.string().valid("Bole", "Geda", "Kereyu", "Fresh", "04", "Posta", "Mebrat", "Other").required(),
  menu: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    description: Joi.string().allow(""),
    image: Joi.string().allow(""),
    inStock: Joi.boolean().default(true),
  })).required(),
  verified: Joi.boolean().default(true),
  ratings: Joi.number().min(0).max(5).default(0),
  reviewsCount: Joi.number().min(0).default(0),
  deliveryTime: Joi.number().min(0).default(30),
  ownerId: Joi.string().required(), // <-- Add this line
});


const rawSeedData = [
  {
    name: "Injera House",
    location: { type: "Point", coordinates: [38.7578, 9.0346] },
    menu: [{ name: "Doro Wat", price: 120, description: "Spicy chicken stew", inStock: true }],
    ratings: 4.8,
    reviewsCount: 120,
    user: { email: "injera@fooddelivery.com", phone: "+251912345678", password: "Injera2025!", role: "restaurant" },
  },
  {
    name: "Little Italy",
    location: { type: "Point", coordinates: [38.7489, 9.0302] },
    menu: [{ name: "Lasagna", price: 150, description: "Cheesy pasta", inStock: true }],
    ratings: 4.5,
    reviewsCount: 150,
    user: { email: "italy@fooddelivery.com", phone: "+251912345679", password: "Italy2025!", role: "restaurant" },
  },
  {
    name: "Sushi Zen",
    location: { type: "Point", coordinates: [38.7611, 9.0403] },
    menu: [{ name: "California Roll", price: 180, description: "Crab & avocado", inStock: true }],
    ratings: 4.7,
    reviewsCount: 200,
    user: { email: "sushi@fooddelivery.com", phone: "+251912345680", password: "Sushi2025!", role: "restaurant" },
  },
  {
    name: "Spice Corner",
    location: { type: "Point", coordinates: [38.755, 9.036] },
    menu: [{ name: "Chicken Curry", price: 130, description: "Savory curry with rice", inStock: true }],
    ratings: 4.2,
    reviewsCount: 80,
    user: { email: "spice@fooddelivery.com", phone: "+251912345681", password: "Spice2025!", role: "restaurant" },
  },
  {
    name: "Burger Hub",
    location: { type: "Point", coordinates: [38.750, 9.038] },
    menu: [{ name: "Cheeseburger", price: 90, description: "Beef burger with cheese", inStock: true }],
    ratings: 4.1,
    reviewsCount: 100,
    user: { email: "burger@fooddelivery.com", phone: "+251912345682", password: "Burger2025!", role: "restaurant" },
  },
  {
    name: "Pasta Palace",
    location: { type: "Point", coordinates: [38.758, 9.042] },
    menu: [{ name: "Spaghetti Bolognese", price: 140, description: "Classic Italian pasta", inStock: true }],
    ratings: 4.6,
    reviewsCount: 95,
    user: { email: "pasta@fooddelivery.com", phone: "+251912345683", password: "Pasta2025!", role: "restaurant" },
  },
  {
    name: "Veggie Delight",
    location: { type: "Point", coordinates: [38.752, 9.033] },
    menu: [{ name: "Grilled Veg Sandwich", price: 80, description: "Healthy and tasty", inStock: true }],
    ratings: 4.4,
    reviewsCount: 70,
    user: { email: "veggie@fooddelivery.com", phone: "+251912345684", password: "Veggie2025!", role: "restaurant" },
  },
  {
    name: "Seafood Shack",
    location: { type: "Point", coordinates: [38.759, 9.035] },
    menu: [{ name: "Grilled Fish", price: 200, description: "Fresh fish with spices", inStock: true }],
    ratings: 4.7,
    reviewsCount: 110,
    user: { email: "seafood@fooddelivery.com", phone: "+251912345685", password: "Seafood2025!", role: "restaurant" },
  },
  {
    name: "Taco Town",
    location: { type: "Point", coordinates: [38.754, 9.039] },
    menu: [{ name: "Beef Taco", price: 100, description: "Spicy taco with beef", inStock: true }],
    ratings: 4.3,
    reviewsCount: 60,
    user: { email: "taco@fooddelivery.com", phone: "+251912345686", password: "Taco2025!", role: "restaurant" },
  },
  {
    name: "Curry Leaf",
    location: { type: "Point", coordinates: [38.756, 9.031] },
    menu: [{ name: "Lamb Curry", price: 160, description: "Delicious lamb curry", inStock: true }],
    ratings: 4.5,
    reviewsCount: 85,
    user: { email: "curry@fooddelivery.com", phone: "+251912345687", password: "Curry2025!", role: "restaurant" },
  },
  {
    name: "BBQ Barn",
    location: { type: "Point", coordinates: [38.751, 9.037] },
    menu: [{ name: "BBQ Ribs", price: 210, description: "Juicy ribs with sauce", inStock: true }],
    ratings: 4.6,
    reviewsCount: 120,
    user: { email: "bbq@fooddelivery.com", phone: "+251912345688", password: "BBQ2025!", role: "restaurant" },
  },
  {
    name: "Noodle Nook",
    location: { type: "Point", coordinates: [38.753, 9.041] },
    menu: [{ name: "Beef Noodles", price: 130, description: "Stir-fried noodles with beef", inStock: true }],
    ratings: 4.4,
    reviewsCount: 75,
    user: { email: "noodle@fooddelivery.com", phone: "+251912345689", password: "Noodle2025!", role: "restaurant" },
  },
  {
    name: "Pizza Planet",
    location: { type: "Point", coordinates: [38.760, 9.036] },
    menu: [{ name: "Pepperoni Pizza", price: 150, description: "Cheesy pepperoni pizza", inStock: true }],
    ratings: 4.5,
    reviewsCount: 140,
    user: { email: "pizza@fooddelivery.com", phone: "+251912345690", password: "Pizza2025!", role: "restaurant" },
  },
  {
    name: "Kebab Kingdom",
    location: { type: "Point", coordinates: [38.757, 9.038] },
    menu: [{ name: "Chicken Kebab", price: 110, description: "Grilled chicken on skewer", inStock: true }],
    ratings: 4.2,
    reviewsCount: 90,
    user: { email: "kebab@fooddelivery.com", phone: "+251912345691", password: "Kebab2025!", role: "restaurant" },
  },
  {
    name: "Salad Stop",
    location: { type: "Point", coordinates: [38.755, 9.034] },
    menu: [{ name: "Caesar Salad", price: 85, description: "Fresh greens with dressing", inStock: true }],
    ratings: 4.3,
    reviewsCount: 65,
    user: { email: "salad@fooddelivery.com", phone: "+251912345692", password: "Salad2025!", role: "restaurant" },
  },
  {
    name: "Wrap & Roll",
    location: { type: "Point", coordinates: [38.758, 9.032] },
    menu: [{ name: "Chicken Wrap", price: 95, description: "Tasty wrap with veggies", inStock: true }],
    ratings: 4.4,
    reviewsCount: 70,
    user: { email: "wrap@fooddelivery.com", phone: "+251912345693", password: "Wrap2025!", role: "restaurant" },
  },
  {
    name: "Dessert Den",
    location: { type: "Point", coordinates: [38.752, 9.039] },
    menu: [{ name: "Chocolate Cake", price: 75, description: "Rich chocolate dessert", inStock: true }],
    ratings: 4.6,
    reviewsCount: 110,
    user: { email: "dessert@fooddelivery.com", phone: "+251912345694", password: "Dessert2025!", role: "restaurant" },
  },
  {
    name: "Grill House",
    location: { type: "Point", coordinates: [38.754, 9.035] },
    menu: [{ name: "Grilled Steak", price: 220, description: "Juicy grilled steak", inStock: true }],
    ratings: 4.7,
    reviewsCount: 130,
    user: { email: "grill@fooddelivery.com", phone: "+251912345695", password: "Grill2025!", role: "restaurant" },
  },
  {
    name: "Biryani Bowl",
    location: { type: "Point", coordinates: [38.759, 9.033] },
    menu: [{ name: "Chicken Biryani", price: 160, description: "Spiced rice with chicken", inStock: true }],
    ratings: 4.5,
    reviewsCount: 90,
    user: { email: "biryani@fooddelivery.com", phone: "+251912345696", password: "Biryani2025!", role: "restaurant" },
  },
  {
    name: "Coffee & Co",
    location: { type: "Point", coordinates: [38.756, 9.040] },
    menu: [{ name: "Cappuccino", price: 50, description: "Hot coffee drink", inStock: true }],
    ratings: 4.2,
    reviewsCount: 50,
    user: { email: "coffee@fooddelivery.com", phone: "+251912345697", password: "Coffee2025!", role: "restaurant" },
  }
];


const areas = ["Bole", "Geda", "Kereyu", "Fresh", "04", "Posta", "Mebrat", "Other"];

const seedRestaurants = async () => {
  try {
    await connectDB();
    await User.deleteMany({ role: "restaurant" });
    await Restaurant.deleteMany();

    for (const data of rawSeedData) {
      const assignedArea = areas[Math.floor(Math.random() * areas.length)];
      const deliveryTime = Math.floor(Math.random() * 20) + 20; // 20-40 mins

      // Validate User
      const { value: userData } = userSchema.validate(data.user);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({ ...userData, password: hashedPassword });
      await user.save();

      // Validate and Create Restaurant
      const restaurantPayload = {
        name: data.name,
        location: data.location,
        area: assignedArea,
        menu: data.menu,
        verified: data.verified || true,
        ratings: data.ratings || 0,
        reviewsCount: data.reviewsCount || 0,
        deliveryTime: deliveryTime,
        ownerId: String(user._id)
      };

      const { error: resError } = restaurantSchema.validate(restaurantPayload);
      if (resError) throw new Error(resError.details[0].message);

      await Restaurant.create(restaurantPayload);
    }

    logger.info("🍽️ Seeded successfully");
    process.exit();
  } catch (err) {
    logger.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
};

seedRestaurants();