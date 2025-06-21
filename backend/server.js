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

// --- API Routes ---
// All API calls will be handled by our new router
app.use("/api", apiRoutes);

// --- SEO & Frontend Serving ---

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
        let title = "Halal Food Near Me - Your Guide to Halal Restaurants";
        let description =
            "Find the best Halal restaurants, takeaways, and eateries in your city. Browse by country, state, or city.";

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
