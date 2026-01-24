const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true },
  image: { type: String, trim: true },
  inStock: { type: Boolean, default: true },
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
  area: { type: String, required: true, trim: true, enum:["Bole", "Geda","Kereyu","Fresh","04","Posta","Mebrat","Other"] }, 
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: { type: String, trim: true },
  menu: [menuItemSchema],
  deliveryTime: { type: Number, required: true, min: 0,default:30 },
  verified: { type: Boolean, default: false },
  ratings: { type: Number, default: 0, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0, min: 0 },
  isOpen: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

restaurantSchema.index({ location: "2dsphere" });
restaurantSchema.index({ ownerId: 1 });
restaurantSchema.index({ area: 1 }); // Added index for area
restaurantSchema.index({ deliveryTime: 1 }); // Added index for delivery time

module.exports = mongoose.model("Restaurant", restaurantSchema);