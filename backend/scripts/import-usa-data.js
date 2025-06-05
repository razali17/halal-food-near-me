require("dotenv").config();
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");
const path = require("path");

async function importUSAData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Read the Excel file
        const filePath = path.join(__dirname, "../../usa-restaurants.xlsx");
        console.log("Reading file from:", filePath);
        const workbook = xlsx.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Transform and clean the data
        const restaurants = data.map((row) => ({
            name: row.name || "Unknown",
            address: row.address || "Unknown",
            city: row.city || "Unknown",
            state: row.state || "Unknown",
            postal_code: row.postal_code || "",
            phone: row.phone || "",
            website: row.website || "",
            cuisine: row.cuisine || "",
            price_range: row.price_range || "",
            rating: row.rating || "",
            photo: row.photo || "",
            street_view: row.street_view || "",
            logo: row.logo || "",
            country: "USA",
            category: "restaurants",
            reviews: 0,
        }));

        // First, remove any existing USA restaurants
        console.log("Removing existing USA restaurants...");
        await Restaurant.deleteMany({ country: "USA" });

        // Insert the new data
        console.log(`Importing ${restaurants.length} restaurants...`);
        await Restaurant.insertMany(restaurants);
        console.log("Import completed successfully");
    } catch (error) {
        console.error("Error importing data:", error);
    } finally {
        await mongoose.disconnect();
    }
}

importUSAData();
