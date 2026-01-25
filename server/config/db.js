const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables!");
    }
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "food-delivery",
    });

    logger.info("MongoDB Atlas connected successfully to 'food-delivery'!");
  } catch (err) {
    logger.error(`MongoDB Atlas connection error: ${err.message}`);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1); 
    } else {
      throw err; 
    }
  }
};


module.exports = connectDB;
// const getAllRestaurants = async (req, res) => {
//   // Redis caching: try to serve cached response, and cache successful responses
//   const cacheKey = `restaurants:${req.originalUrl}`;
//   try {
//     const cached = await redisClient.get(cacheKey);
//     if (cached) {
//       return res.status(200).json(JSON.parse(cached));
//     }
//   } catch (err) {
//     logger.error("Redis get error in getAllRestaurants:", err.message);
//   }

//   // Intercept res.json to cache successful responses
//   const _originalJson = res.json.bind(res);
//   res.json = (body) => {
//     try {
//       if (res.statusCode === 200) {
//         // cache for 60 seconds (adjust TTL as needed)
//         redisClient
//           .setEx(cacheKey, 60, JSON.stringify(body))
//           .catch((e) => logger.error("Redis set error in getAllRestaurants:", e.message));
//       }
//     } catch (e) {
//       logger.error("Error while attempting to cache response:", e.message);
//     }
//     return _originalJson(body);
//   };
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       sort = 'recommended',
//       search = '',
//       area = '',
//       minDelivery = '', // Renamed to match Sidebar params
//       maxDelivery = '', // Renamed to match Sidebar params
//       isOpen = '',
//     } = req.query;

//     // Base query: Only show verified and non-deleted restaurants
//     const query = {
//       deleted: false,
//       verified: true,
//     };

//     // 1. Search by restaurant name
//     if (search) {
//       query.name = { $regex: search.trim(), $options: 'i' };
//     }

//     // 2. Filter by Area (Matches enum in Restaurant.js)
//     if (area && area !== '') {
//       query.area = area; 
//     }

//     // 3. Filter by delivery time range
//     if (minDelivery || maxDelivery) {
//       query.deliveryTime = {};
//       if (minDelivery) query.deliveryTime.$gte = parseInt(minDelivery);
//       if (maxDelivery) query.deliveryTime.$lte = parseInt(maxDelivery);
//     }

//     // 4. Filter by open status
//     if (isOpen === 'true') query.isOpen = true;
//     if (isOpen === 'false') query.isOpen = false;

//     // 5. Sorting Logic
//     let sortQuery = {};

//     switch (sort) {
//       case 'rating':
//         sortQuery = { ratings: -1, reviewsCount: -1 };
//         break;
//       case 'delivery_time':
//         // Ensure this matches the field name in your Restaurant model!
//         sortQuery = { deliveryTime: 1 }; 
//         break;
//       case 'reviews':
//         sortQuery = { reviewsCount: -1 };
//         break;
//       case 'newest':
//         sortQuery = { createdAt: -1 };
//         break;
//       case 'recommended':
//       default:
//         // Use a multi-criteria sort for recommended
//         sortQuery = { ratings: -1, reviewsCount: -1 };
//         break;
//     }

//     const pageNum = parseInt(page);
//     const limitNum = parseInt(limit);
//     const skip = (pageNum - 1) * limitNum;

//     const [restaurants, total] = await Promise.all([
//       Restaurant.find(query)
//         .sort(sortQuery)
//         .skip(skip)
//         .limit(limitNum)
//         .select('-deleted -__v'),
//       Restaurant.countDocuments(query),
//     ]);

//     res.status(200).json({
//       success: true,
//       restaurants,
//       pagination: {
//         currentPage: pageNum,
//         totalPages: Math.ceil(total / limitNum),
//         totalItems: total,
//       },
//     });
//   } catch (err) {
//     console.error("Failed to fetch restaurants:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

//     res.status(201).json({ message: "Menu item added", menu: restaurant.menu });
//   } catch (error) {
//     logger.error("Error adding menu item:", error);
//     res
//       .status(500)
//       .json({ error: "Failed to add menu item", details: error.message });
//   }
// };
