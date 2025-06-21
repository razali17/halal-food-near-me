const express = require("express");
const Restaurant = require("../models/Restaurant");
const { normalizeRegion } = require("../utils/regionMaps");

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
    res.json({ status: "ok", message: "API is running" });
});

// Unified: Get all regions (states/provinces) for a country
router.get("/regions", async (req, res) => {
    try {
        const country = req.query.country;
        if (!country)
            return res.status(400).json({ message: "country is required" });
        const query = { country: new RegExp(`^${country}$`, "i") };
        const regions = await Restaurant.distinct("state", query);
        const normalized = Array.from(
            new Set(regions.map((r) => normalizeRegion(r, country)))
        ).filter(Boolean);
        res.json(normalized.sort());
    } catch (error) {
        console.error("/api/regions error:", error);
        res.status(500).json({ message: error.message });
    }
});

// Unified: Get all cities for a country and region
router.get("/cities", async (req, res) => {
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
router.get("/restaurants/search", async (req, res) => {
    try {
        const { q, country = "Canada" } = req.query;
        if (!q) {
            return res
                .status(400)
                .json({ message: "Search query is required" });
        }
        const restaurants = await Restaurant.find(
            { $text: { $search: q }, country },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Unified: Get restaurants by location (country, state, city)
router.get("/restaurants/location", async (req, res) => {
    try {
        const { city, state, country = "Canada" } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        const query = { country: new RegExp(`^${country}$`, "i") };
        if (state) query.state = { $regex: new RegExp(state, "i") };
        if (city) query.city = { $regex: new RegExp(city, "i") };

        let sortField = req.query.sort || "name";
        let sortDirection = req.query.direction === "desc" ? -1 : 1;
        let sortObj = {};
        let useRandom = false;

        if (sortField === "rating") sortObj["rating"] = sortDirection;
        else if (sortField === "random") useRandom = true;
        else sortObj["name"] = sortDirection;

        const total = await Restaurant.countDocuments(query);
        let restaurants;

        if (useRandom) {
            restaurants = await Restaurant.aggregate([
                { $match: query },
                { $sample: { size: limit } },
            ]);
        } else {
            restaurants = await Restaurant.find(query)
                .sort(sortObj)
                .skip(skip)
                .limit(limit)
                .lean();
        }

        res.json({
            restaurants,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                hasMore: page * limit < total,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single restaurant by ID
router.get("/restaurants/:id", async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
