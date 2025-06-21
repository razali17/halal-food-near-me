require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Restaurant = require("../models/Restaurant");

const MONGODB_URI = process.env.MONGODB_URI;
const BASE_URL = "https://www.halalfoodnearme.org"; // Your production URL

async function generateSitemap() {
    console.log("Starting sitemap generation...");

    if (!MONGODB_URI) {
        console.error(
            "MONGODB_URI is not defined in your environment variables."
        );
        process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Fetch all unique locations (country, state, city)
    const locations = await Restaurant.aggregate([
        {
            $group: {
                _id: { country: "$country", state: "$state", city: "$city" },
            },
        },
        { $sort: { "_id.country": 1, "_id.state": 1, "_id.city": 1 } },
    ]);

    console.log(`Found ${locations.length} unique locations.`);

    const urls = [];

    // Use a Set to avoid duplicate country and state pages
    const countryPages = new Set();
    const statePages = new Set();

    locations.forEach((loc) => {
        const { country, state, city } = loc._id;
        if (!country) return;

        // Add country page
        if (!countryPages.has(country)) {
            urls.push(`${BASE_URL}/${encodeURIComponent(country)}`);
            countryPages.add(country);
        }

        // Add state page
        if (state) {
            const statePath = `${country}/${encodeURIComponent(state)}`;
            if (!statePages.has(statePath)) {
                urls.push(`${BASE_URL}/${statePath}`);
                statePages.add(statePath);
            }
        }

        // Add city page
        if (city && state) {
            const cityPath = `${country}/${encodeURIComponent(
                state
            )}/${encodeURIComponent(city)}`;
            urls.push(`${BASE_URL}/${cityPath}`);
        }
    });

    const sitemapContent = `
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${urls
                .map(
                    (url) => `
                <url>
                    <loc>${url}</loc>
                    <changefreq>weekly</changefreq>
                    <priority>0.8</priority>
                </url>
            `
                )
                .join("")}
        </urlset>
    `.trim();

    const sitemapPath = path.join(
        __dirname,
        "../../frontend/dist",
        "sitemap.xml"
    );
    const distDir = path.dirname(sitemapPath);

    // Ensure the output directory exists
    if (!fs.existsSync(distDir)) {
        console.log(`Output directory ${distDir} not found. Creating it...`);
        fs.mkdirSync(distDir, { recursive: true });
    }

    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log(`✅ Sitemap successfully generated at ${sitemapPath}`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
}

generateSitemap().catch((err) => {
    console.error("Sitemap generation failed:", err);
    process.exit(1);
});
