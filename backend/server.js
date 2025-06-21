require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs"); // Import the file system module
const apiRoutes = require("./routes/api"); // Import the new API router
const { normalizeRegion } = require("./utils/regionMaps");

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const DEFAULT_IMAGE_URL =
    process.env.DEFAULT_IMAGE_URL || "/images/default-restaurant.jpg";

// Middleware to normalize multiple slashes in the URL path.
app.use((req, res, next) => {
    if (req.path.includes("//")) {
        const newPath = req.path.replace(/\/{2,}/g, "/");
        // Re-add query string if it exists
        const search = req.originalUrl.substring(req.path.length);
        req.url = newPath + search;
    }
    next();
});

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

// --- API Routes ---
// All API calls will be handled by our new router
app.use("/api", apiRoutes);

// API 404 handler - This must be after the API router and before the frontend serving logic
app.use("/api/*", (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
});

// --- SEO & Frontend Serving ---

// Middleware to prevent API routes from being handled by frontend serving logic
app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
        return next(); // Pass to the API router, do not attempt to serve files
    }
    // For all other requests, proceed to the static file serving and SEO logic
    next();
});

// Serve React build files from the 'dist' directory
app.use(express.static(path.join(__dirname, "../frontend/dist")));

const ALLOWED_COUNTRIES = ["usa", "canada", "uk"];

// This route handles dynamic meta tags for SEO
app.get("/:country/:state?/:city?", async (req, res, next) => {
    // Let static file handler handle requests for assets like CSS or JS
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

        // Validate the country parameter (case-insensitive)
        if (!ALLOWED_COUNTRIES.includes(country.toLowerCase())) {
            // If country is not valid, send 404 status but still serve the app
            // so React Router can display its own Not Found page.
            return res.status(404).sendFile(indexPath);
        }

        // Dynamic SEO values based on URL
        let title = "Halal Food Near Me - Find Halal Restaurants";
        let description =
            "Your ultimate directory for halal restaurants. Find halal chinese food, mexican food, and more in the USA, UK, and Canada.";

        if (city && state && country) {
            title = `The Best Halal Restaurants in ${city}, ${state}`;
            description = `Looking for halal food near you in ${city}? Browse our directory for the best halal mexican food, chinese food, and more. Find restaurants open now.`;
        } else if (state && country) {
            title = `Best Halal Food in ${state}, ${country}`;
            description = `The complete guide to halal dining in ${state}. Discover the best halal restaurants, from shawarma to chicken, across all cities.`;
        } else if (country) {
            title = `Halal Food Directory for ${country.toUpperCase()}`;
            description = `Find ${country.toUpperCase()} halal food near you. Our directory lists the best halal restaurants, including chinese, mexican, and more cuisines.`;
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
