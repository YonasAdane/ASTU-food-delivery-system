const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables!");
    }

    // Explicitly set the database name to avoid defaulting to 'test'
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "food-delivery",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info("MongoDB Atlas connected successfully to 'food-delivery'!");
  } catch (err) {
    logger.error(`MongoDB Atlas connection error: ${err.message}`);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1); // stop server if not in test
    } else {
      throw err; // re-throw for testing
    }
  }
};


module.exports = connectDB;
