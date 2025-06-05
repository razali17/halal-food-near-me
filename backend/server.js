require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Restaurant = require("./models/Restaurant");

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Middleware
app.use(
    cors({
        origin: [FRONTEND_URL],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
    })
);

// Add Content-Security-Policy header
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; img-src 'self' https://lh3.googleusercontent.com data:; style-src 'self' 'unsafe-inline';"
    );
    next();
});

app.use(express.json());

// Serve images from a public directory
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Connect to MongoDB
mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// Routes

// Get all restaurants
app.get("/api/restaurants", async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all provinces/states
app.get("/api/provinces", async (req, res) => {
    try {
        const country = req.query.country || "Canada";
        const states = await Restaurant.distinct("state", { country });
        res.json(states.sort());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all cities
app.get("/api/cities", async (req, res) => {
    try {
        const country = req.query.country || "Canada";
        const cities = await Restaurant.distinct("city", { country });
        res.json(cities.sort());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get cities by province/state
app.get("/api/cities/:state", async (req, res) => {
    try {
        const country = req.query.country || "Canada";
        const cities = await Restaurant.distinct("city", {
            state: { $regex: new RegExp(req.params.state, "i") },
            country,
        });
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

// Get restaurants by state/province
app.get("/api/restaurants/state/:state", async (req, res) => {
    try {
        const country = req.query.country || "Canada";
        const restaurants = await Restaurant.find({
            state: { $regex: new RegExp(req.params.state, "i") },
            country,
        });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get restaurants by city
app.get("/api/restaurants/city/:city", async (req, res) => {
    try {
        const country = req.query.country || "Canada";
        const restaurants = await Restaurant.find({
            city: { $regex: new RegExp(req.params.city, "i") },
            country,
        });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get restaurants by postal code
app.get("/api/restaurants/postal/:postalCode", async (req, res) => {
    try {
        const restaurants = await Restaurant.find({
            postal_code: { $regex: new RegExp(req.params.postalCode, "i") },
        });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get restaurants by location (city and state)
app.get("/api/restaurants/location", async (req, res) => {
    try {
        const { city, state, country = "Canada" } = req.query;
        const query = { country };

        if (city) {
            query.city = { $regex: new RegExp(city, "i") };
        }
        if (state) {
            query.state = { $regex: new RegExp(state, "i") };
        }

        const restaurants = await Restaurant.find(query);

        // Transform the data to match frontend format
        const transformedRestaurants = restaurants.map((restaurant) => {
            // Convert MongoDB document to plain object
            const rest = restaurant.toObject();

            // Transform _id to id
            rest.id = rest._id.toString();
            delete rest._id;
            delete rest.__v;

            // Log original URLs
            console.log("Original photo URL:", rest.photo);
            console.log("Original street_view URL:", rest.street_view);
            console.log("Original logo URL:", rest.logo);

            // Handle photo URLs
            if (rest.photo) {
                if (rest.photo.includes("AF1QipP")) {
                    // Keep AF1QipP URLs as they are
                    rest.photo = rest.photo;
                } else if (
                    rest.street_view &&
                    rest.street_view.includes("AF1QipP")
                ) {
                    // Use street view if it's in AF1QipP format
                    rest.photo = rest.street_view;
                } else {
                    // Use default for any other format
                    rest.photo =
                        "http://localhost:5001/images/default-restaurant.jpg";
                }
            } else if (
                rest.street_view &&
                rest.street_view.includes("AF1QipP")
            ) {
                // Use street view if no photo but street view is available
                rest.photo = rest.street_view;
            } else {
                // Use default if no valid photos available
                rest.photo =
                    "http://localhost:5001/images/default-restaurant.jpg";
            }

            // Transform logo URLs to higher resolution
            if (rest.logo && rest.logo.includes("googleusercontent.com")) {
                // Replace s44 with s200 for higher resolution
                rest.logo = rest.logo.replace(
                    /=s\d+(-p)?-k-no(-ns)?(-nd)?/,
                    "=s200-c"
                );
            }

            // Log transformed URLs
            console.log("Transformed photo URL:", rest.photo);
            console.log("Transformed logo URL:", rest.logo);

            return rest;
        });

        res.json(transformedRestaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
