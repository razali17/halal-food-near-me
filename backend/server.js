require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs"); // Import the file system module
const Restaurant = require("./models/Restaurant");
const { normalizeRegion } = require("./utils/regionMaps");

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const DEFAULT_IMAGE_URL =
    process.env.DEFAULT_IMAGE_URL || "/images/default-restaurant.jpg";

// Middleware to redirect apex domain to www
app.use((req, res, next) => {
    // In production, Heroku sends 'x-forwarded-proto'
    const protocol = req.get("x-forwarded-proto") || req.protocol;
    const host = req.get("host");

    // Only redirect in production environment
    if (
        process.env.NODE_ENV === "production" &&
        host === "halalfoodnearme.org"
    ) {
        const fullUrl = `${protocol}://www.halalfoodnearme.org${req.originalUrl}`;
        console.log(
            `Redirecting apex domain: ${host}${req.originalUrl} -> ${fullUrl}`
        );
        return res.redirect(301, fullUrl);
    }

    next();
});

// CORS configuration
const allowedOrigins = [
    "https://www.halalfoodnearme.org",
    "https://halalfoodnearme.org",
    "http://localhost:5173", // Add local development server
    "http://127.0.0.1:5173", // Add local development server alternative
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) === -1) {
                const msg =
                    "The CORS policy for this site does not allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
            "Origin",
        ],
    })
);

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!" });
});

// Body parsing middleware with limits
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Serve images from a public directory
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Connect to MongoDB
mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Handle MongoDB connection errors
mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

// Handle process errors
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    // Log error and continue instead of shutting down
    console.error(err.stack);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    // Log error and continue instead of shutting down
    console.error(err.stack);
});

// Routes

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});

// Get all restaurants
app.get("/api/restaurants", async (req, res) => {
    try {
        const { state, city, country = "Canada", cuisine } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const query = { country };
        if (state) query.state = { $regex: new RegExp(state, "i") };
        if (city) query.city = { $regex: new RegExp(city, "i") };
        if (cuisine) query.cuisineType = { $regex: new RegExp(cuisine, "i") };

        // Get total count for pagination
        const total = await Restaurant.countDocuments(query);

        // Get paginated results
        const restaurants = await Restaurant.find(query)
            .skip(skip)
            .limit(limit)
            .lean(); // Use lean() for better performance

        res.json({
            restaurants,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                hasMore: skip + restaurants.length < total,
            },
        });
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ error: "Failed to fetch restaurants" });
    }
});

// Unified: Get all regions (states/provinces) for a country
app.get("/api/regions", async (req, res) => {
    try {
        const country = req.query.country;
        console.log("/api/regions called with country:", country);
        if (!country)
            return res.status(400).json({ message: "country is required" });
        // Use case-insensitive regex for country
        const query = { country: new RegExp(`^${country}$`, "i") };
        console.log("MongoDB query:", query);
        const regions = await Restaurant.distinct("state", query);
        console.log("MongoDB result (regions):", regions);
        // Normalize and deduplicate regions
        const normalized = Array.from(
            new Set(regions.map((r) => normalizeRegion(r, country)))
        ).filter(Boolean);
        console.log("Normalized regions:", normalized);
        res.json(normalized.sort());
    } catch (error) {
        console.error("/api/regions error:", error);
        res.status(500).json({ message: error.message });
    }
});

// Unified: Get all cities for a country and region
app.get("/api/cities", async (req, res) => {
    try {
        const { country, state } = req.query;
        if (!country)
            return res.status(400).json({ message: "country is required" });
        const query = { country: new RegExp(`^${country}$`, "i") };
        if (state) query.state = { $regex: new RegExp(state, "i") };
        const cities = await Restaurant.distinct("city", query);
        res.json(cities.sort());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search restaurants by name or description
app.get("/api/restaurants/search", async (req, res) => {
    try {
        const { q, country = "Canada" } = req.query;
        if (!q) {
            return res
                .status(400)
                .json({ message: "Search query is required" });
        }

        const restaurants = await Restaurant.find(
            {
                $text: { $search: q },
                country,
            },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } });

        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Unified: Get restaurants by location (country, state, city)
app.get("/api/restaurants/location", async (req, res) => {
    try {
        const { city, state, country = "Canada" } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        console.log("/api/restaurants/location called with:", {
            country,
            state,
            city,
            page,
            limit,
        });

        // Use case-insensitive regex for country
        const query = { country: new RegExp(`^${country}$`, "i") };
        if (state) query.state = { $regex: new RegExp(state, "i") };
        if (city) query.city = { $regex: new RegExp(city, "i") };

        console.log("MongoDB query:", query);

        // Sorting logic
        let sortField = req.query.sort || "name";
        let sortDirection = req.query.direction === "desc" ? -1 : 1;
        let sortObj = {};
        let useRandom = false;
        if (sortField === "rating") {
            sortObj["rating"] = sortDirection;
        } else if (sortField === "random") {
            useRandom = true;
        } else {
            sortObj["name"] = sortDirection;
        }

        // Get total count for pagination
        const total = await Restaurant.countDocuments(query);

        let restaurants;
        if (useRandom) {
            // Use aggregation with $match and $sample for random sort
            restaurants = await Restaurant.aggregate([
                { $match: query },
                { $sample: { size: limit } },
            ]);
        } else {
            // Get paginated results
            restaurants = await Restaurant.find(query)
                .sort(sortObj)
                .skip(skip)
                .limit(limit)
                .lean();
        }

        console.log("Restaurants found:", restaurants.length, "/", total);

        res.json({
            restaurants,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                hasMore: skip + restaurants.length < total,
            },
        });
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ error: "Failed to fetch restaurants" });
    }
});

// Add a new restaurant
app.post("/api/restaurants", async (req, res) => {
    try {
        const restaurant = new Restaurant(req.body);
        const newRestaurant = await restaurant.save();
        res.status(201).json(newRestaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a restaurant
app.put("/api/restaurants/:id", async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json(restaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a restaurant
app.delete("/api/restaurants/:id", async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json({ message: "Restaurant deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Deprecated endpoints (for reference, can be removed after migration):
// app.get("/api/provinces", ...)
// app.get("/api/cities/:state", ...)
// app.get("/api/restaurants/state/:state", ...)
// app.get("/api/restaurants/city/:city", ...)

// --- SEO & Frontend Serving ---

// Serve React build files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// This route handles dynamic meta tags for SEO
app.get("/:country/:state?/:city?", async (req, res, next) => {
    // Let static file handler handle requests for assets
    if (req.path.includes(".")) {
        return next();
    }

    try {
        const { country, state, city } = req.params;
        const indexPath = path.resolve(
            __dirname,
            "../frontend/dist",
            "index.html"
        );

        // Default SEO values
        let title = "Halal Food Near Me - Your Guide to Halal Restaurants";
        let description =
            "Find the best Halal restaurants, takeaways, and eateries in your city. Browse by country, state, or city.";

        // Dynamic SEO values based on URL
        if (city && state && country) {
            title = `Halal Restaurants in ${city}, ${state}, ${country}`;
            description = `Find, review, and get directions to the best Halal restaurants in ${city}, ${state}.`;
        } else if (state && country) {
            title = `Halal Restaurants in ${state}, ${country}`;
            description = `Browse all Halal-certified restaurants across cities in ${state}, ${country}.`;
        } else if (country) {
            title = `Halal Restaurants in ${country}`;
            description = `The complete guide to Halal food and dining in ${country}.`;
        }

        fs.readFile(indexPath, "utf8", (err, htmlData) => {
            if (err) {
                console.error("Error reading index.html:", err);
                return res.status(500).end();
            }

            // Inject dynamic SEO tags
            let finalHtml = htmlData
                .replace(/__TITLE__/g, title)
                .replace(/__DESCRIPTION__/g, description)
                .replace(/__OG_TITLE__/g, title)
                .replace(/__OG_DESCRIPTION__/g, description);

            res.send(finalHtml);
        });
    } catch (error) {
        console.error("SEO route error:", error);
        res.status(500).send("Server error while generating page.");
    }
});

// Catch-all to serve React's index.html for any other routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});
